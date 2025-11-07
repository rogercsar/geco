import React, { useMemo, useState, useEffect } from 'react';
import { ROOM_CATEGORIES, computeVariantCost } from '../data/simulation';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { toast } from 'react-hot-toast';

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

  useEffect(() => {
    try { localStorage.setItem('simSelections', JSON.stringify(selections)); } catch {}
  }, [selections]);
  useEffect(() => {
    try { localStorage.setItem('simPaid', paid ? 'true' : 'false'); } catch {}
  }, [paid]);

  const category = useMemo(() => ROOM_CATEGORIES.find(c => c.key === activeCat), [activeCat]);
  const categoryByKey = useMemo(() => Object.fromEntries(ROOM_CATEGORIES.map(c => [c.key, c.name])), []);
  const catMap = useMemo(() => Object.fromEntries(ROOM_CATEGORIES.map(c => [c.key, c])), []);
  const currentSelection = selections[activeCat] || null;
  const summaries = useMemo(() => Object.entries(selections).map(([key, v]) => ({ key, variant: v, cost: computeVariantCost(v) })), [selections]);
  const grandTotal = useMemo(() => summaries.reduce((sum, s) => sum + s.cost.total, 0), [summaries]);

  const tabs = ROOM_CATEGORIES.map(c => ({ key: c.key, label: c.name }));




  const ImageGrid = () => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentSelection ? [1,2,3].map((i) => (
        <Card key={i}>
          <CardHeader><CardTitle>Imagem {i}</CardTitle></CardHeader>
          <CardContent>
            <img src={currentSelection.image || getPlaceholderImage(currentSelection.title)} alt={`Preview ${i}`} className="w-full h-40 object-cover rounded" />
            <p className="text-secondary-600 mt-2">Gerada com base na seleção atual (placeholder)</p>
          </CardContent>
        </Card>
      )) : (
        <div className="text-secondary-600">Selecione uma opção acima para gerar imagens</div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-sm text-secondary-600 mb-1">
        <a href="/">Início</a>
        <span className="mx-2">/</span>
        <span className="text-secondary-900 font-medium">Simulação de Cômodos</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">Simule o custo de materiais por cômodo</h1>
      <p className="text-secondary-600">Escolha um cômodo e uma opção pré-definida para ver a metragem e o custo total estimado de materiais. Baixe a lista por R$ 5 ou fale com nosso escritório.</p>

      {(Tabs ? (
        // Use the reusable Tabs component instead of local fallback
        <Tabs tabs={tabs} active={activeCat} onChange={setActiveCat} />
      ) : (
        <FallbackTabs tabs={tabs} active={activeCat} onChange={setActiveCat} />
      ))}

      {/* Variants */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.variants.map(v => (
          <Card key={v.id} className={currentSelection?.id === v.id ? 'ring-2 ring-primary-600' : ''}>
            <CardHeader>
              <CardTitle>{v.title} • {v.area} m²</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={v.image || category.thumbnail || getPlaceholderImage(v.title)} alt={v.title} className="w-full h-40 object-cover rounded" />
              <div className="mt-3 flex justify-between items-center">
                <Button variant="outline" onClick={() => setSelections(prev => ({ ...prev, [category.key]: v }))}>Selecionar</Button>
                <span className="text-secondary-600">Materiais médios</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Resultado */}
      <section>
        <Card>
          <CardHeader><CardTitle>Resultado da simulação</CardTitle></CardHeader>
          <CardContent>
            // ... existing code ...
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
                     }}>Pagar R$ 5 para baixar</Button>
                   )}
                   <Button variant="outline" onClick={() => {
                     if (!paid) return toast.error('Pagamento necessário para baixar');
                     if (!summaries.length) return toast.error('Selecione pelo menos um cômodo');
                     const date = new Date().toLocaleString('pt-BR');
                     const sections = summaries.map(({ key, variant, cost }) => {
                       const itemsRows = cost.items.map(i => `<tr><td style=\"padding:8px;border:1px solid #ddd;\">${i.name}</td><td style=\"padding:8px;border:1px solid #ddd;\">${i.unit}</td><td style=\"padding:8px;border:1px solid #ddd;\">${i.qty.toFixed(2)}</td><td style=\"padding:8px;border:1px solid #ddd;\">R$ ${i.unitCost.toFixed(2)}</td><td style=\"padding:8px;border:1px solid #ddd;\">R$ ${i.total.toFixed(2)}</td></tr>`).join('');
                       return `<h2 style=\"font-size:16px;margin:16px 0 6px;\">${catMap[key]?.name || key} • ${variant.title} • Área ${cost.area} m²</h2>` +
                              `<table style=\"border-collapse:collapse;width:100%;\"><thead><tr>` +
                              `<th style=\"text-align:left;padding:8px;border:1px solid #ddd;\">Item</th>` +
                              `<th style=\"text-align:left;padding:8px;border:1px solid #ddd;\">Unidade</th>` +
                              `<th style=\"text-align:left;padding:8px;border:1px solid #ddd;\">Qtd</th>` +
                              `<th style=\"text-align:left;padding:8px;border:1px solid #ddd;\">Custo un.</th>` +
                              `<th style=\"text-align:left;padding:8px;border:1px solid #ddd;\">Total</th>` +
                              `</tr></thead><tbody>${itemsRows}</tbody></table>` +
                              `<div style=\"font-weight:700;margin-top:6px;\">Total do cômodo: R$ ${cost.total.toFixed(2)}</div>`;
                     }).join('');
                     const html = `<!doctype html><html><head><meta charset=\"utf-8\"/><title>Simulação de Cômodos</title><style>body{font-family:Arial,sans-serif;color:#111827;padding:16px;}h1{font-size:20px;margin-bottom:4px}.header{border-bottom:1px solid #e5e7eb;padding-bottom:8px;margin-bottom:12px}.total{font-weight:800;font-size:16px;margin-top:10px}</style></head><body><div class=\"header\"><h1>Simulação de Cômodos</h1><div>Data: ${date}</div></div>${sections}<div class=\"total\">Total geral: R$ ${grandTotal.toFixed(2)}</div></body></html>`;
                     const win = window.open('', '_blank');
                     if (!win) return toast.error('Pop-up bloqueado; permita pop-ups para gerar o PDF');
                     win.document.write(html);
                     win.document.close();
                     win.focus();
                     win.print();
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
             ) : (
               <p className="text-secondary-600">Selecione opções nos cômodos para ver os totais.</p>
             )}
           </CardContent>
        </Card>
      </section>

      {/* Imagens geradas */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-secondary-900">Imagens geradas</h2>
          <Button variant="outline" onClick={() => {
            if (!currentSelection) return toast.error('Selecione uma opção');
            toast.success('Imagens geradas (demo)');
          }}>Gerar 3 imagens</Button>
        </div>
        <ImageGrid />
      </section>
    </div>
  );
}