export const ROOM_CATEGORIES = [
  {
    key: 'sala',
    name: 'Sala',
    variants: [
      {
        id: 'sala-compacta',
        title: 'Sala Compacta',
        area: 12,
        image: 'https://images.unsplash.com/photo-1505692794403-34d4982ad1a0?w=800&q=80&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1493666438817-866a91353cae?w=800&q=80&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1519711139269-9c25143c49f1?w=800&q=80&auto=format&fit=crop',
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
    variants: [
      {
        id: 'quarto-single', title: 'Quarto Single', area: 10,
        image: 'https://images.unsplash.com/photo-1505691723518-36a10e3a0ba1?w=800&q=80&auto=format&fit=crop',
        materials: [
          { name: 'Piso laminado', unit: 'm²', costPerSqm: 75, qtyPerSqm: 1 },
          { name: 'Tinta acrílica', unit: 'm²', costPerSqm: 10, qtyPerSqm: 1.2 }
        ]
      },
      {
        id: 'quarto-casal', title: 'Quarto Casal', area: 16,
        image: 'https://images.unsplash.com/photo-1468655541595-9a9d4e4ee442?w=800&q=80&auto=format&fit=crop',
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
    variants: [
      {
        id: 'cozinha-compacta', title: 'Cozinha Compacta', area: 8,
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80&auto=format&fit=crop',
        materials: [
          { name: 'Piso cerâmico', unit: 'm²', costPerSqm: 65, qtyPerSqm: 1 },
          { name: 'Azulejo parede', unit: 'm²', costPerSqm: 55, qtyPerSqm: 2.2 },
          { name: 'Tinta lavável', unit: 'm²', costPerSqm: 14, qtyPerSqm: 0.5 }
        ]
      },
      {
        id: 'cozinha-padrao', title: 'Cozinha Padrão', area: 12,
        image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1564540587773-2ec8ee45356e?w=800&q=80&auto=format&fit=crop',
        materials: [
          { name: 'Piso cerâmico', unit: 'm²', costPerSqm: 70, qtyPerSqm: 1 },
          { name: 'Revestimento parede', unit: 'm²', costPerSqm: 60, qtyPerSqm: 3 },
          { name: 'Tinta lavável', unit: 'm²', costPerSqm: 14, qtyPerSqm: 0.4 }
        ]
      },
      {
        id: 'banheiro-suite', title: 'Banheiro Suíte', area: 6,
        image: 'https://images.unsplash.com/photo-1617093726243-d6b66d8f3ed1?w=800&q=80&auto=format&fit=crop',
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
    variants: [
      {
        id: 'escritorio-compacto', title: 'Escritório Compacto', area: 9,
        image: 'https://images.unsplash.com/photo-1507209696997-4ba779b6e6a3?w=800&q=80&auto=format&fit=crop',
        materials: [
          { name: 'Piso laminado', unit: 'm²', costPerSqm: 78, qtyPerSqm: 1 },
          { name: 'Tinta acrílica', unit: 'm²', costPerSqm: 10, qtyPerSqm: 1.2 }
        ]
      },
      {
        id: 'escritorio-padrao', title: 'Escritório Padrão', area: 14,
        image: 'https://images.unsplash.com/photo-1449247612389-9b5f1b37c97e?w=800&q=80&auto=format&fit=crop',
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