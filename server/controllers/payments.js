const { MercadoPagoConfig, PreApproval, Preference } = require('mercadopago');
// const User = require('../models/User'); // Mongo não será usado
const { supabase } = require('../config/supabase');

const mp = () => {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('MP_ACCESS_TOKEN não configurado no .env');
  }
  return {
    preapproval: new PreApproval(new MercadoPagoConfig({ accessToken })),
    preference: new Preference(new MercadoPagoConfig({ accessToken }))
  };
};

const PLAN_PRICES = {
  pro: 49.9,
  empresarial: 99.9,
};

const PERIODS = {
  mensal: { frequency: 1, label: 'Mensal' },
  semestral: { frequency: 6, label: 'Semestral' },
  anual: { frequency: 12, label: 'Anual' },
};

exports.createSubscription = async (req, res) => {
  try {
    const { plan, period, email } = req.body;

    if (!plan || !period || !email) {
      return res.status(400).json({ success: false, msg: 'Parâmetros inválidos: plan, period e email são obrigatórios.' });
    }

    const planKey = String(plan).toLowerCase();
    if (!PLAN_PRICES[planKey]) {
      return res.status(400).json({ success: false, msg: 'Plano inválido. Use: pro ou empresarial.' });
    }

    const periodKey = String(period).toLowerCase();
    if (!PERIODS[periodKey]) {
      return res.status(400).json({ success: false, msg: 'Período inválido. Use: mensal, semestral ou anual.' });
    }

    const unitPrice = PLAN_PRICES[planKey];
    const { frequency, label } = PERIODS[periodKey];
    const amount = +(unitPrice * frequency).toFixed(2);

    const backUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/callback`;

    const client = mp();
    const preapproval = await client.preapproval.create({
      payer_email: email,
      back_url: backUrl,
      reason: `Assinatura Geco - ${planKey} (${label})`,
      external_reference: `${email}|${planKey}|${periodKey}`,
      auto_recurring: {
        frequency,
        frequency_type: 'months',
        transaction_amount: amount,
        currency_id: 'BRL',
      },
    });

    const initPoint = preapproval?.init_point || preapproval?.sandbox_init_point;
    if (!initPoint) {
      return res.status(500).json({ success: false, msg: 'Falha ao criar assinatura no Mercado Pago.' });
    }

    return res.status(200).json({ success: true, init_point: initPoint, id: preapproval?.id });
  } catch (err) {
    console.error('Erro createSubscription:', err);
    return res.status(500).json({ success: false, msg: err.message || 'Erro interno.' });
  }
};

exports.createSimulationPayment = async (req, res) => {
  try {
    const { variantId, category } = req.body || {};
    if (!variantId) {
      return res.status(400).json({ success: false, msg: 'variantId é obrigatório.' });
    }
    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';

    const client = mp();
    const preference = await client.preference.create({
      items: [
        {
          title: 'Download lista de materiais (simulação)',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 5.0,
        },
      ],
      external_reference: `simulation:${variantId}${category ? `:${category}` : ''}`,
      back_urls: {
        success: `${frontend}/payment/callback`,
        failure: `${frontend}/payment/callback`,
        pending: `${frontend}/payment/callback`,
      },
      auto_return: 'approved',
    });

    const initPoint = preference?.init_point || preference?.sandbox_init_point;
    if (!initPoint) {
      return res.status(500).json({ success: false, msg: 'Falha ao criar pagamento da simulação.' });
    }
    return res.status(200).json({ success: true, init_point: initPoint, id: preference?.id });
  } catch (err) {
    console.error('Erro createSimulationPayment:', err);
    return res.status(500).json({ success: false, msg: err.message || 'Erro interno.' });
  }
};

exports.webhook = async (req, res) => {
  try {
    const type = req.query?.type || req.body?.type || null;
    const id = req.query?.id || req.query?.['data.id'] || req.body?.id || req.body?.data?.id || req.body?.resource?.id || null;

    // Se não houver tipo/id, apenas confirmar recebimento
    if (!id) {
      return res.status(200).json({ received: true });
    }

    // Obter detalhes da preapproval
    const client = mp();
    let preapprovalInfo = null;
    try {
      preapprovalInfo = await client.get({ id });
    } catch (e) {
      console.warn('Falha ao obter preapproval:', id, e?.message);
    }

    if (preapprovalInfo) {
      const status = preapprovalInfo?.status || 'unknown';
      const externalRef = preapprovalInfo?.external_reference || '';
      const [email, planKey, periodKey] = externalRef.split('|');

      // Status que confirmam a assinatura
      const okStatuses = ['authorized', 'approved', 'active', 'confirmed'];
      if (okStatuses.includes(String(status).toLowerCase()) && email) {
        const planTitle = planKey === 'pro' ? 'Pro' : planKey === 'empresarial' ? 'Empresarial' : 'Básico';

        if (!supabase) {
          console.warn('Supabase client indisponível no backend. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.');
        } else {
          try {
            // Atualizar perfil do usuário na tabela 'users' do Supabase
            const { error } = await supabase
              .from('users')
              .update({
                plan: planTitle,
                subscription_mp_id: id,
                subscription_period: periodKey,
                subscription_status: status,
                updated_at: new Date().toISOString(),
              })
              .eq('email', email);
            if (error) {
              console.error('Falha ao atualizar usuário no Supabase:', error.message);
            }
          } catch (e) {
            console.error('Erro Supabase webhook update:', e.message || e);
          }
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Erro webhook:', err);
    return res.status(200).json({ received: true });
  }
};