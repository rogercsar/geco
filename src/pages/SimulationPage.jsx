import React, { useMemo, useState } from 'react';
import { ROOM_CATEGORIES, computeVariantCost } from '../data/simulation';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs'; // if not exists, fallback implemented below
import { toast } from 'react-hot-toast';

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
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [paid, setPaid] = useState(false);

  const category = useMemo(() => ROOM_CATEGORIES.find(c => c.key === activeCat), [activeCat]);
  const cost = useMemo(() => selectedVariant ? computeVariantCost(selectedVariant) : null, [selectedVariant]);

  const tabs = ROOM_CATEGORIES.map(c => ({ key: c.key, label: c.name }));

  const handlePay = () => {
    // Mock de pagamento de R$ 5. Integração real: MercadoPago/Stripe com callback
    setPaid(true);
    toast.success('Pagamento de R$ 5 confirmado (demo)');
  };

  const handleDownloadCSV = () => {
    if (!paid) {
      toast.error('Pagamento de R$ 5 é necessário para baixar');
      return;
    }
    if (!cost) return;

    const rows = [['Item','Unidade','Quantidade','Custo Unitário','Total']];
    cost.items.forEach(i => rows.push([i.name, i.unit, i.qty.toFixed(2), i.unitCost.toFixed(2), i.total.toFixed(2)]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `materiais_${selectedVariant.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999';
  const handleWhatsApp = () => {
    if (!selectedVariant || !cost) return;
    const text = encodeURIComponent(`Olá! Quero avançar com o projeto \nCômodo: ${category.name} - ${selectedVariant.title}\nÁrea: ${selectedVariant.area} m²\nTotal materiais estimados: R$ ${cost.total.toFixed(2)}`);
    const link = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(link, '_blank');
  };

  const ImageGrid = () => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {selectedVariant ? [1,2,3].map((i) => (
        <Card key={i}>
          <CardHeader><CardTitle>Imagem {i}</CardTitle></CardHeader>
          <CardContent>
            <img src={selectedVariant.image} alt={`Preview ${i}`} className="w-full h-40 object-cover rounded" />
            <p className="text-secondary-600 mt-2">Gerada com base na seleção (placeholder)</p>
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
        <Tabs tabs={tabs} active={activeCat} onChange={setActiveCat} />
      ) : (
        <FallbackTabs tabs={tabs} active={activeCat} onChange={setActiveCat} />
      ))}

      {/* Variants */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.variants.map(v => (
          <Card key={v.id} className={selectedVariant?.id === v.id ? 'ring-2 ring-primary-600' : ''}>
            <CardHeader>
              <CardTitle>{v.title} • {v.area} m²</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={v.image} alt={v.title} className="w-full h-40 object-cover rounded" />
              <div className="mt-3 flex justify-between items-center">
                <Button variant="outline" onClick={() => setSelectedVariant(v)}>Selecionar</Button>
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
            {selectedVariant && cost ? (
              <div className="space-y-3">
                <p className="text-secondary-700">Cômodo: <strong>{category.name}</strong> • Opção: <strong>{selectedVariant.title}</strong> • Área: <strong>{cost.area} m²</strong></p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-secondary-600">
                        <th className="py-2 pr-4">Item</th>
                        <th className="py-2 pr-4">Unidade</th>
                        <th className="py-2 pr-4">Qtd</th>
                        <th className="py-2 pr-4">Custo un.</th>
                        <th className="py-2 pr-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cost.items.map((i) => (
                        <tr key={i.name} className="border-t border-secondary-200">
                          <td className="py-2 pr-4">{i.name}</td>
                          <td className="py-2 pr-4">{i.unit}</td>
                          <td className="py-2 pr-4">{i.qty.toFixed(2)}</td>
                          <td className="py-2 pr-4">R$ {i.unitCost.toFixed(2)}</td>
                          <td className="py-2 pr-4">R$ {i.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-secondary-900 font-semibold">Total estimado de materiais: R$ {cost.total.toFixed(2)}</p>
                  <div className="space-x-2">
                    {!paid && (
                      <Button onClick={handlePay}>Pagar R$ 5 para baixar</Button>
                    )}
                    <Button variant="outline" onClick={handleDownloadCSV} disabled={!paid}>Baixar lista (CSV)</Button>
                    <Button variant="outline" onClick={handleWhatsApp}>Quero esse projeto</Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-secondary-600">Selecione uma opção para ver o resultado.</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Imagens geradas */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-secondary-900">Imagens geradas</h2>
          <Button variant="outline" onClick={() => {
            if (!selectedVariant) return toast.error('Selecione uma opção');
            toast.success('Imagens geradas (demo)');
          }}>Gerar 3 imagens</Button>
        </div>
        <ImageGrid />
      </section>
    </div>
  );
}