import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ROOM_CATEGORIES, computeVariantCost } from '../data/simulation';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/layout/Sidebar';
import { Home, Sofa, Bed, Utensils, ShowerHead } from 'lucide-react';


// Helper para imagem placeholder inline (SVG)
const getPlaceholderImage = (label = 'Cômodo') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="20" font-family="Arial">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

function FallbackTabs({ tabs, active, onChange }) {
  return (
    <div className="border-b border-secondary-200 mb-6 flex space-x-2 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 rounded-t ${active === t.key ? 'bg-white border border-secondary-200 border-b-0 text-secondary-900' : 'text-secondary-600 hover:text-secondary-900'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function SimulationPage() {
  const [activeCat, setActiveCat] = useState(ROOM_CATEGORIES[0].key);
  const [selections, setSelections] = useState(() => {
    try { const s = localStorage.getItem('simSelections'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [paid, setPaid] = useState(() => {
    try { return localStorage.getItem('simPaid') === 'true'; } catch { return false; }
  });
  // Estado para destacar âncora ativa
  const [activeSec, setActiveSec] = useState('sec-opcoes');
  // Observer para atualizar seção ativa
  useEffect(() => {
    const ids = ['sec-opcoes', 'sec-resultado', 'sec-imagens'];
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSec(visible[0].target.id);
      },
      { root: null, threshold: [0.2, 0.5, 0.8], rootMargin: '0px 0px -30% 0px' }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  // Smooth scroll para cliques do sumário
  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  useEffect(() => {
    try { localStorage.setItem('simSelections', JSON.stringify(selections)); } catch {}
  }, [selections]);
  useEffect(() => {
    try { localStorage.setItem('simPaid', paid ? 'true' : 'false'); } catch {}
  }, [paid]);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('paid');
      if (p === '1') {
        setPaid(true);
        toast.success('Pagamento aprovado');
        const url = new URL(window.location.href);
        url.searchParams.delete('paid');
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}
  }, []);
  
  const resetSimulation = () => {
    setSelections({});
    setPaid(false);
    try {
      localStorage.removeItem('simSelections');
      localStorage.removeItem('simPaid');
    } catch {}
    toast.success('Simulação reiniciada');
  };
  const category = useMemo(() => ROOM_CATEGORIES.find(c => c.key === activeCat), [activeCat]);
  const categoryByKey = useMemo(() => Object.fromEntries(ROOM_CATEGORIES.map(c => [c.key, c.name])), []);
  const catMap = useMemo(() => Object.fromEntries(ROOM_CATEGORIES.map(c => [c.key, c])), []);
const currentSelection = selections[activeCat] || null;

// Helpers de imagens por cômodo (public/simulacoes/<key>/<key><n>.jpg)
const resolveRoomImageSrc = (key, i) => `/simulacoes/${key}/${key}${i}.jpg`;
const onRoomImgError = (e, key, i) => {
  const attempt = Number(e.currentTarget.dataset.attempt || 0);
  if (attempt === 0) {
    e.currentTarget.src = `/simulacoes/${key}/${key}${i}.png`;
    e.currentTarget.dataset.attempt = 1;
  } else if (attempt === 1) {
    e.currentTarget.src = (catMap[key]?.thumbnail) || getPlaceholderImage(catMap[key]?.name || key);
    e.currentTarget.dataset.attempt = 2;
  }
};

// --------- Mosaico do projeto (canvas) ---------
// Remover o bloco de mosaico e implementar composição nos 3 campos
// Helpers de imagem local para cada cômodo
const getRoomPrimaryImageSrc = (key) => `/simulacoes/${key}/${key}1.jpg`;
const loadRoomImage = (key) => new Promise((resolve) => {
  const tryLoad = (srcs, idx = 0) => {
    if (idx >= srcs.length) {
      const img = new Image();
      img.src = (catMap[key]?.thumbnail) || getPlaceholderImage(catMap[key]?.name || key);
      img.onload = () => resolve(img);
      img.onerror = () => resolve(img);
      return;
    }
    const img = new Image();
    img.src = srcs[idx];
    img.onload = () => resolve(img);
    img.onerror = () => tryLoad(srcs, idx + 1);
  };
  tryLoad([getRoomPrimaryImageSrc(key), `/simulacoes/${key}/${key}1.png`]);
});

const [compUrls, setCompUrls] = useState([null, null, null]);
const shuffle = (arr) => arr.map(v => ({ r: Math.random(), v })).sort((a,b)=>a.r-b.r).map(o=>o.v);
// Adiciona lightbox para ampliar imagens
const [lightboxUrl, setLightboxUrl] = useState(null);

const composeOrderToDataURL = async (order) => {
  const cols = Math.ceil(Math.sqrt(order.length));
  const rows = Math.ceil(order.length / cols);
  const tileW = 320, tileH = 200, gap = 6;
  const width = cols * tileW + (cols - 1) * gap;
  const height = rows * tileH + (rows - 1) * gap;
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, width, height);
  for (let idx = 0; idx < order.length; idx++) {
    const key = order[idx];
    const img = await loadRoomImage(key);
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = col * (tileW + gap);
    const y = row * (tileH + gap);
    const ratio = Math.min(img.width / tileW || 1, img.height / tileH || 1);
    const drawW = img.width / ratio;
    const drawH = img.height / ratio;
    const offsetX = x + (tileW - drawW) / 2;
    const offsetY = y + (tileH - drawH) / 2;
    try { ctx.drawImage(img, offsetX, offsetY, drawW, drawH); } catch {}
    ctx.strokeStyle = '#e5e7eb';
    ctx.strokeRect(x, y, tileW, tileH);
  }
  return canvas.toDataURL('image/png');
};

const buildPdfHtml = (summaries, catMap, grandTotal, date) => {
  const sections = summaries.map(({ key, variant, cost }) => {
    const itemsRows = cost.items.map(i => `<tr><td style="padding:8px;border:1px solid #ddd;">${i.name}</td><td style="padding:8px;border:1px solid #ddd;">${i.unit}</td><td style="padding:8px;border:1px solid #ddd;">${i.qty.toFixed(2)}</td><td style="padding:8px;border:1px solid #ddd;">R$ ${i.unitCost.toFixed(2)}</td><td style="padding:8px;border:1px solid #ddd;">R$ ${i.total.toFixed(2)}</td></tr>`).join('');
    return `<h2 style="font-size:16px;margin:16px 0 6px;">${catMap[key]?.name || key} • ${variant.title} • Área ${cost.area} m²</h2>` +
           `<table style="border-collapse:collapse;width:100%;"><thead><tr>` +
           `<th style="text-align:left;padding:8px;border:1px solid #ddd;">Item</th>` +
           `<th style="text-align:left;padding:8px;border:1px solid #ddd;">Unidade</th>` +
           `<th style="text-align:left;padding:8px;border:1px solid #ddd;">Qtd</th>` +
           `<th style="text-align:left;padding:8px;border:1px solid #ddd;">Custo un.</th>` +
           `<th style="text-align:left;padding:8px;border:1px solid #ddd;">Total</th>` +
           `</tr></thead><tbody>${itemsRows}</tbody></table>` +
           `<div style="font-weight:700;margin-top:6px;">Total do cômodo: R$ ${cost.total.toFixed(2)}</div>`;
  }).join('');
  return `<!doctype html><html><head><meta charset="utf-8"/><title>Simulação de Cômodos</title><style>body{font-family:Arial,sans-serif;color:#111827;padding:16px;}h1{font-size:20px;margin-bottom:4px}.header{border-bottom:1px solid #e5e7eb;padding-bottom:8px;margin-bottom:12px}.total{font-weight:800;font-size:16px;margin-top:10px}</style></head><body><div class="header"><h1>Simulação de Cômodos</h1><div>Data: ${date}</div></div>${sections}<div class="total">Total geral: R$ ${grandTotal.toFixed(2)}</div></body></html>`;
};
const openPdfWindow = (html) => {
  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
  return true;
};

const generateCompositions = async () => {
   const keys = Object.keys(selections);
   if (!keys.length) { toast.error('Selecione pelo menos um cômodo'); return; }
   const orders = [shuffle([...keys]), shuffle([...keys]), shuffle([...keys])];
   const urls = [
     await composeOrderToDataURL(orders[0]),
     await composeOrderToDataURL(orders[1]),
     await composeOrderToDataURL(orders[2]),
   ];
   setCompUrls(urls);
   toast.success('3 imagens geradas a partir das seleções');
 };
   const summaries = useMemo(() => Object.entries(selections).map(([key, v]) => ({ key, variant: v, cost: computeVariantCost(v) })), [selections]);
   const grandTotal = useMemo(() => summaries.reduce((sum, s) => sum + s.cost.total, 0), [summaries]);

  const tabs = ROOM_CATEGORIES.map(c => ({ key: c.key, label: c.name }));




  const ImageGrid = () => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentSelection ? [1,2,3].map((i) => (
        <Card key={i} className="border-2 border-primary-200 hover:border-primary-400 transition-colors">
          <CardHeader><CardTitle>Imagem {i}</CardTitle></CardHeader>
          <CardContent>
            <img
              src={resolveRoomImageSrc(activeCat, i)}
              data-attempt="0"
              onError={(e) => onRoomImgError(e, activeCat, i)}
              alt={`Preview ${i}`}
              className="w-full h-40 object-cover rounded"
            />
          </CardContent>
        </Card>
      )) : (
        <div className="text-secondary-600">Selecione uma opção acima para gerar imagens</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-50">
      <Sidebar />
      <main className="lg:ml-64 container mx-auto px-4 pt-2 pb-8 space-y-6">
          <div className="text-sm text-secondary-600 mb-1">
            <a href="/">Início</a>
            <span className="mx-2">/</span>
            <span className="text-secondary-900 font-medium">Simulação de Cômodos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">Simule o custo de materiais por cômodo</h1>
          <p className="text-secondary-600">Escolha um cômodo e uma opção pré-definida para ver a metragem e o custo total estimado de materiais. Baixe a lista por R$ 5 ou fale com nosso escritório.</p>

          {(Tabs ? (
            <Tabs tabs={tabs} active={activeCat} onChange={setActiveCat} />
          ) : (
            <FallbackTabs tabs={tabs} active={activeCat} onChange={setActiveCat} />
          ))}

          <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-8">
            <div className="space-y-6">
              {/* Grid de variantes com âncora */}
              <section id="sec-opcoes" className="space-y-4 scroll-mt-24">
                <h2 className="text-xl font-bold text-secondary-900">Opções do cômodo</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.variants.map((v, idx) => {
                    const imgIndex = Math.min((idx % 5) + 1, 5);
                    const cost = computeVariantCost(v);
                    const selected = currentSelection?.id === v.id;
                    return (
                      <Card key={v.id} className={`${selected ? 'border-2 border-primary-600' : 'border-2 border-primary-200'} hover:border-primary-400 transition-colors`}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <RoomIcon keyName={category.key} />
                            {v.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <img
                            src={resolveRoomImageSrc(category.key, imgIndex)}
                            data-attempt="0"
                            onError={(e) => onRoomImgError(e, category.key, imgIndex)}
                            alt={v.title}
                            className="w-full h-40 object-cover rounded"
                          />
                          <div className="mt-3 flex justify-between items-center">
                            <Button variant="outline" onClick={() => setSelections(prev => ({ ...prev, [category.key]: { ...v, _imgIndex: imgIndex } }))}>Selecionar</Button>
                            <span className="text-secondary-600">{`${v.area} m² • R$ ${cost.total.toFixed(2)}`}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>

              <section id="sec-resultado" className="group border border-secondary-200 rounded-lg bg-white scroll-mt-24">
                  <Card className="border-2 border-primary-200">
                    <CardHeader><CardTitle>Resultado da simulação</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="mt-1">
                          <table className="w-full border border-secondary-200 rounded overflow-hidden">
                            <thead className="bg-secondary-50">
                              <tr>
                                <th className="text-left p-2">Cômodo</th>
                                <th className="text-left p-2">Variante</th>
                                <th className="text-left p-2">Área (m²)</th>
                                <th className="text-right p-2">Total (R$)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {summaries.map(({ key, variant, cost }) => (
                                <tr key={key} className="border-t border-secondary-100">
                                  <td className="p-2">{catMap[key]?.name || categoryByKey[key]}</td>
                                  <td className="p-2">{variant.title}</td>
                                  <td className="p-2">{cost.area}</td>
                                  <td className="p-2 text-right">R$ {cost.total.toFixed(2)}</td>
                                </tr>
                              ))}
                              <tr className="border-t-2 border-secondary-300 bg-secondary-50">
                                <td className="p-2 font-bold" colSpan={3}>Total geral</td>
                                <td className="p-2 text-right font-extrabold">R$ {grandTotal.toFixed(2)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-2">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={resetSimulation}>Nova simulação</Button>
                          </div>
                          <div className="flex items-center gap-2">
                            {!paid && (
                              <Button onClick={async () => {
                                try {
                                  const base = import.meta.env.VITE_MP_API_URL || 'http://localhost:3001';
                                  const resp = await fetch(`${base}/api/mp/create-preference`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      amount: 5,
                                      description: 'Acesso PDF/WhatsApp - Simulação',
                                      success_url: window.location.origin + window.location.pathname
                                    })
                                  });
                                  const data = await resp.json();
                                  if (!resp.ok) throw new Error(data?.message || 'Falha ao criar preferência');
                                  const url = data.init_point || data.sandbox_init_point;
                                  if (!url) throw new Error('URL de checkout não recebida');
                                  window.open(url, '_blank');
                                  toast.info('Redirecionando para Mercado Pago...');
                                } catch (e) {
                                  console.error(e);
                                  toast.error(e.message || 'Erro ao iniciar pagamento');
                                }
                              }}>Pagar R$ 5</Button>
                            )}
                            <Button variant="outline" onClick={() => {
                              if (!paid) return toast.error('Pagamento necessário para baixar');
                              if (!summaries.length) return toast.error('Selecione pelo menos um cômodo');
                              const date = new Date().toLocaleString('pt-BR');
                              const html = buildPdfHtml(summaries, catMap, grandTotal, date);
                              const ok = openPdfWindow(html);
                              if (!ok) toast.error('Pop-up bloqueado; permita pop-ups para gerar o PDF');
                            }}>Baixar PDF</Button>
                            <Button variant="outline" onClick={() => {
                              const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999';
                              if (!summaries.length) return toast.error('Selecione pelo menos um cômodo');
                              const lines = summaries.map(({ key, variant, cost }) => `${catMap[key]?.name || key}: ${variant.title} • Área ${cost.area} m² • Total R$ ${cost.total.toFixed(2)}`).join('\n');
                              const text = encodeURIComponent(`Olá! Quero avançar com o projeto.\n\n${lines}\n\nTotal geral: R$ ${grandTotal.toFixed(2)}`);
                              const link = `https://wa.me/${whatsappNumber}?text=${text}`;
                              window.open(link, '_blank');
                            }}>Quero esse projeto</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>
            </div>

              {/* Seção de imagens simples com âncora */}
               <div className="space-y-6">
                 <section id="sec-imagens" className="space-y-3 scroll-mt-24">
                   <div className="flex items-center justify-between">
                     <h2 className="text-xl font-bold text-secondary-900">Imagens geradas</h2>
                     <Button variant="outline" onClick={generateCompositions}>Gerar 3 imagens</Button>
                   </div>
                   <div className="grid lg:grid-cols-3 gap-6">
                     {Object.keys(selections).length ? [0,1,2].map((i) => (
                       <Card key={i} className="border-2 border-primary-200 hover:border-primary-400 transition-colors">
                         <CardHeader><CardTitle>Imagem {i+1}</CardTitle></CardHeader>
                         <CardContent>
                           <img
                             src={compUrls[i] || getPlaceholderImage('Composição')}
                             alt={`Composição ${i+1}`}
                             className="w-full h-40 object-cover rounded cursor-zoom-in"
                             onClick={() => setLightboxUrl(compUrls[i] || getPlaceholderImage('Composição'))}
                           />
                         </CardContent>
                       </Card>
                     )) : (
                       <div className="text-secondary-600">Selecione opções nos cômodos para gerar as composições</div>
                     )}
                   </div>
                 </section>
               </div>

{lightboxUrl && (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={() => setLightboxUrl(null)}>
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button className="absolute -top-10 right-0 text-white text-2xl" aria-label="Fechar" onClick={() => setLightboxUrl(null)}>×</button>
      <img src={lightboxUrl} alt="Imagem ampliada" className="max-w-[90vw] max-h-[85vh] rounded shadow-2xl" />
    </div>
  </div>
)}

        </main>
    </div>
  );
}

// Ícone por tipo de cômodo (fallback seguro)
const RoomIcon = ({ keyName }) => {
  const size = 18;
  const k = String(keyName || '').toLowerCase();
  const ICON_MAP = {
    sala: Sofa,
    quarto: Bed,
    cozinha: Utensils,
    banheiro: ShowerHead,
    lavabo: ShowerHead,
    living: Sofa,
  };
  const IconCmp = ICON_MAP[k] || Home;
  return <IconCmp size={size} className="text-secondary-700" />;
};