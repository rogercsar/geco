const makeThumb = (emoji, label) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="40">${emoji}</text><text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="16" font-family="Arial">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
export const ROOM_CATEGORIES = [
  {
    key: 'sala',
    name: 'Sala',
    thumbnail: makeThumb('🛋️', 'Sala'),
    variants: [
      {
        id: 'sala-compacta',
        title: 'Sala Compacta',
        area: 12,
        image: '',
        materials: [
          { name: 'Piso laminado', unit: 'm²', costPerSqm: 80, qtyPerSqm: 1 },
          { name: 'Rodapé MDF', unit: 'm', costPerSqm: 12, qtyPerSqm: 0.8 },
          { name: 'Tinta acrílica', unit: 'm²', costPerSqm: 10, qtyPerSqm: 1.2 }
        ]
      },
      {
        id: 'sala-padrao',
        title: 'Sala Padrão',
        area: 18,
        image: '',
        materials: [
          { name: 'Piso porcelanato', unit: 'm²', costPerSqm: 120, qtyPerSqm: 1 },
          { name: 'Rodapé PVC', unit: 'm', costPerSqm: 15, qtyPerSqm: 0.8 },
          { name: 'Tinta premium', unit: 'm²', costPerSqm: 18, qtyPerSqm: 1.2 }
        ]
      },
      {
        id: 'sala-ampla',
        title: 'Sala Ampla',
        area: 24,
        image: '',
        materials: [
          { name: 'Piso vinílico', unit: 'm²', costPerSqm: 95, qtyPerSqm: 1 },
          { name: 'Rodapé poliestireno', unit: 'm', costPerSqm: 20, qtyPerSqm: 0.8 },
          { name: 'Tinta acrílica', unit: 'm²', costPerSqm: 12, qtyPerSqm: 1.2 }
        ]
      },
      {
        id: 'sala-luxo',
        title: 'Sala Luxo',
        area: 30,
        image: '',
        materials: [
          { name: 'Piso madeira maciça', unit: 'm²', costPerSqm: 220, qtyPerSqm: 1 },
          { name: 'Rodapé madeira', unit: 'm', costPerSqm: 35, qtyPerSqm: 0.8 },
          { name: 'Tinta premium', unit: 'm²', costPerSqm: 22, qtyPerSqm: 1.2 }
        ]
      },
      {
        id: 'sala-integrada',
        title: 'Sala Integrada',
        area: 22,
        image: '',
        materials: [
          { name: 'Piso porcelanato', unit: 'm²', costPerSqm: 130, qtyPerSqm: 1 },
          { name: 'Rodapé PVC', unit: 'm', costPerSqm: 16, qtyPerSqm: 0.8 },
          { name: 'Tinta premium', unit: 'm²', costPerSqm: 20, qtyPerSqm: 1.2 }
        ]
      }
    ]
  },
  {
    key: 'quarto',
    name: 'Quarto',
    thumbnail: makeThumb('🛏️', 'Quarto'),
    variants: [
      {
        id: 'quarto-single', title: 'Quarto Single', area: 10,
        image: '',
        materials: [
          { name: 'Piso laminado', unit: 'm²', costPerSqm: 75, qtyPerSqm: 1 },
          { name: 'Tinta acrílica', unit: 'm²', costPerSqm: 10, qtyPerSqm: 1.2 }
        ]
      },
      {
        id: 'quarto-casal', title: 'Quarto Casal', area: 16,
        image: '',
        materials: [
          { name: 'Piso vinílico', unit: 'm²', costPerSqm: 90, qtyPerSqm: 1 },
          { name: 'Tinta premium', unit: 'm²', costPerSqm: 18, qtyPerSqm: 1.2 }
        ]
      }
    ]
  },
  {
    key: 'cozinha',
    name: 'Cozinha',
    thumbnail: makeThumb('🍳', 'Cozinha'),
    variants: [
      {
        id: 'cozinha-compacta', title: 'Cozinha Compacta', area: 8,
        image: '',
        materials: [
          { name: 'Piso cerâmico', unit: 'm²', costPerSqm: 65, qtyPerSqm: 1 },
          { name: 'Azulejo parede', unit: 'm²', costPerSqm: 55, qtyPerSqm: 2.2 },
          { name: 'Tinta lavável', unit: 'm²', costPerSqm: 14, qtyPerSqm: 0.5 }
        ]
      },
      {
        id: 'cozinha-padrao', title: 'Cozinha Padrão', area: 12,
        image: '',
        materials: [
          { name: 'Piso porcelanato', unit: 'm²', costPerSqm: 120, qtyPerSqm: 1 },
          { name: 'Azulejo parede', unit: 'm²', costPerSqm: 65, qtyPerSqm: 2.2 },
          { name: 'Tinta epóxi', unit: 'm²', costPerSqm: 22, qtyPerSqm: 0.5 }
        ]
      }
    ]
  },
  {
    key: 'banheiro',
    name: 'Banheiro',
    variants: [
      {
        id: 'banheiro-social', title: 'Banheiro Social', area: 4,
        image: '',
        materials: [
          { name: 'Piso cerâmico', unit: 'm²', costPerSqm: 70, qtyPerSqm: 1 },
          { name: 'Revestimento parede', unit: 'm²', costPerSqm: 60, qtyPerSqm: 3 },
          { name: 'Tinta lavável', unit: 'm²', costPerSqm: 14, qtyPerSqm: 0.4 }
        ]
      },
      {
        id: 'banheiro-suite', title: 'Banheiro Suíte', area: 6,
        image: '',
        materials: [
          { name: 'Piso porcelanato', unit: 'm²', costPerSqm: 120, qtyPerSqm: 1 },
          { name: 'Revestimento parede', unit: 'm²', costPerSqm: 80, qtyPerSqm: 3 },
          { name: 'Tinta epóxi', unit: 'm²', costPerSqm: 22, qtyPerSqm: 0.4 }
        ]
      }
    ]
  },
  {
    key: 'escritorio',
    name: 'Escritório',
    thumbnail: makeThumb('💼', 'Escritório'),
    variants: [
      {
        id: 'escritorio-compacto', title: 'Escritório Compacto', area: 9,
        image: '',
        materials: [
          { name: 'Piso laminado', unit: 'm²', costPerSqm: 78, qtyPerSqm: 1 },
          { name: 'Tinta acrílica', unit: 'm²', costPerSqm: 10, qtyPerSqm: 1.2 }
        ]
      },
      {
        id: 'escritorio-padrao', title: 'Escritório Padrão', area: 14,
        image: '',
        materials: [
          { name: 'Piso vinílico', unit: 'm²', costPerSqm: 92, qtyPerSqm: 1 },
          { name: 'Tinta premium', unit: 'm²', costPerSqm: 18, qtyPerSqm: 1.2 }
        ]
      }
    ]
  }
];

export function computeVariantCost(variant) {
  const area = variant.area;
  const items = variant.materials.map(m => {
    const qty = m.qtyPerSqm * area;
    const total = m.costPerSqm * qty;
    return { name: m.name, unit: m.unit, qty, unitCost: m.costPerSqm, total };
  });
  const total = items.reduce((sum, i) => sum + i.total, 0);
  return { area, items, total };
}