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

  useEffect(() => {
    try { localStorage.setItem('simSelections', JSON.stringify(selections)); } catch {}
  }, [selections]);

  const category = useMemo(() => ROOM_CATEGORIES.find(c => c.key === activeCat), [activeCat]);
  const categoryByKey = useMemo(() => Object.fromEntries(ROOM_CATEGORIES.map(c => [c.key, c.name])), []);
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
              <img src={v.image || getPlaceholderImage(v.title)} alt={v.title} className="w-full h-40 object-cover rounded" />
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
            {summaries.length > 0 ? (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {summaries.map(({ key, variant, cost }) => (
                    <div key={key} className="border border-secondary-200 rounded p-3 flex items-center gap-3">
                      <img src={variant.image || getPlaceholderImage(categoryByKey[key])} alt={variant.title} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-secondary-700"><strong>{categoryByKey[key]}</strong> • {variant.title}</p>
                        <p className="text-secondary-600">Área: {cost.area} m²</p>
                      </div>
                      <p className="text-secondary-900 font-semibold">R$ {cost.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-secondary-900 font-bold">Total geral dos cômodos</p>
                  <p className="text-secondary-900 font-extrabold">R$ {grandTotal.toFixed(2)}</p>
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