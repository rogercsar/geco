import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../utils/supabase';
import { setUser } from '../../features/authSlice';

const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const status = (searchParams.get('status') || 'pending').toLowerCase();
  const preapprovalId = searchParams.get('preapproval_id') || null;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const okStatuses = ['authorized', 'approved', 'active', 'confirmed'];
  const isSuccess = okStatuses.includes(status);

  useEffect(() => {
    const refreshUser = async () => {
      try {
        if (!supabase) return; // Supabase não configurado
        const email = user?.email;
        if (!email) return;

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
        if (error) throw error;
        if (data) {
          dispatch(setUser({
            id: data.id,
            email: data.email,
            name: data.name,
            plan: data.plan,
            is_admin: !!data.is_admin,
          }));
        }
      } catch (e) {
        console.warn('Falha ao sincronizar usuário após pagamento:', e?.message || e);
      }
    };
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preapprovalId, status]);

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-secondary-900 mb-3">
          {isSuccess ? 'Assinatura confirmada' : 'Status do Pagamento'}
        </h1>
        <p className={`mb-2 ${isSuccess ? 'text-green-700' : 'text-secondary-700'}`}>
          Status: <span className={`font-semibold ${isSuccess ? 'text-green-800' : 'text-secondary-900'}`}>{status}</span>
        </p>
        {preapprovalId && (
          <p className="text-secondary-700 mb-4">ID da Assinatura: <span className="font-mono">{preapprovalId}</span></p>
        )}
        <p className="text-secondary-600 mb-6">
          {isSuccess
            ? 'Tudo certo! Assim que o Mercado Pago confirmar via webhook, seu plano será atualizado automaticamente.'
            : 'Assim que o pagamento for confirmado pelo Mercado Pago, seu plano será atualizado.'}
        </p>
        <div className="flex gap-3">
          <Link to="/dashboard" className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition">Voltar ao Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallbackPage;