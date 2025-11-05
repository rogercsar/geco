import { FORNECEDORES } from './constants.js';

// Materiais por etapa da obra
export const MATERIAIS = {
  'Radier': [
    { 
      id: 16, 
      nome: 'Lona Plástica Preta (m²)', 
      unidade: 'm²', 
      prices: [
        { supplierId: 1, price: 3.50 },
        { supplierId: 3, price: 4.00 },
        { supplierId: 9, price: 3.80 }
      ]
    },
    { 
      id: 17, 
      nome: 'Malha de Aço POP (painel)', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 39.50 },
        { supplierId: 3, price: 42.00 },
        { supplierId: 6, price: 45.00 }
      ]
    }
  ],
  'Baldrame': [
    { 
      id: 18, 
      nome: 'Tábua de Pinus 30cm (m)', 
      unidade: 'm', 
      prices: [
        { supplierId: 1, price: 12.00 },
        { supplierId: 4, price: 11.50 },
        { supplierId: 7, price: 13.00 }
      ]
    },
    { 
      id: 19, 
      nome: 'Impermeabilizante Neutrol (lata 18L)', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 180.00 },
        { supplierId: 3, price: 185.50 }
      ]
    }
  ],
  'Viga': [
    { 
      id: 20, 
      nome: 'Estribo de Aço 4.2mm (un)', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 0.80 },
        { supplierId: 4, price: 0.82 },
        { supplierId: 8, price: 0.85 }
      ]
    }
  ],
  'Laje': [
    { 
      id: 21, 
      nome: 'Lajota Cerâmica H8 (un)', 
      unidade: 'un', 
      prices: [
        { supplierId: 4, price: 2.20 },
        { supplierId: 1, price: 2.35 },
        { supplierId: 9, price: 2.40 }
      ]
    },
    { 
      id: 22, 
      nome: 'Vigota de Concreto Protendido (m)', 
      unidade: 'm', 
      prices: [
        { supplierId: 1, price: 25.00 },
        { supplierId: 4, price: 24.00 }
      ]
    }
  ],
  'Reboco': [
    { 
      id: 23, 
      nome: 'Cal Hidratada (saco 20kg)', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 15.00 },
        { supplierId: 2, price: 14.50 },
        { supplierId: 6, price: 16.00 }
      ]
    },
    { 
      id: 24, 
      nome: 'Areia Fina Lavada (m³)', 
      unidade: 'm³', 
      prices: [
        { supplierId: 1, price: 115.00 },
        { supplierId: 6, price: 125.00 },
        { supplierId: 7, price: 120.00 },
        { supplierId: 8, price: 118.00 }
      ]
    }
  ],
  'Hidrossanitárias': [
    { 
      id: 25, 
      nome: 'Tubo PVC Esgoto 100mm (barra 6m)', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 65.00 },
        { supplierId: 3, price: 63.00 }
      ]
    },
    { 
      id: 26, 
      nome: 'Tubo PVC Soldável 25mm (barra 6m)', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 20.00 },
        { supplierId: 3, price: 19.50 }
      ]
    },
    { 
      id: 27, 
      nome: 'Caixa Sifonada 150x150mm', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 22.00 },
        { supplierId: 3, price: 21.00 },
        { supplierId: 6, price: 23.00 }
      ]
    }
  ],
  'Muro': [
    { 
      id: 28, 
      nome: 'Bloco de Concreto 14x19x39', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 3.80 },
        { supplierId: 4, price: 3.70 },
        { supplierId: 8, price: 3.90 }
      ]
    },
    { 
      id: 29, 
      nome: 'Canaleta de Concreto 14x19x39', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 5.50 },
        { supplierId: 4, price: 5.30 },
        { supplierId: 9, price: 5.60 }
      ]
    },
    { 
      id: 30, 
      nome: 'Argamassa Pronta (saco 20kg)', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 18.00 },
        { supplierId: 3, price: 18.90 },
        { supplierId: 7, price: 19.50 }
      ]
    }
  ],
  'Bloco Estrutural': [
    { 
      id: 31, 
      nome: 'Bloco Estrutural de Concreto 14x19x39', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 4.20 },
        { supplierId: 4, price: 4.10 },
        { supplierId: 6, price: 4.50 }
      ]
    },
    { 
      id: 32, 
      nome: 'Graute (saco 25kg)', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 35.00 },
        { supplierId: 1, price: 34.00 },
        { supplierId: 9, price: 36.00 }
      ]
    }
  ],
  'Bloco Cerâmico': [
    { 
      id: 33, 
      nome: 'Bloco Cerâmico 9x19x19 (Tijolo Baiano)', 
      unidade: 'un', 
      prices: [
        { supplierId: 4, price: 1.80 },
        { supplierId: 6, price: 2.10 },
        { supplierId: 7, price: 2.05 },
        { supplierId: 9, price: 2.00 }
      ]
    }
  ],
  'Tijolo Maciço': [
    { 
      id: 34, 
      nome: 'Tijolo Maciço Comum', 
      unidade: 'un', 
      prices: [
        { supplierId: 4, price: 0.90 },
        { supplierId: 1, price: 0.95 }
      ]
    }
  ],
  'Steel Frame': [
    { 
      id: 35, 
      nome: 'Montante de Aço Galvanizado 90mm (m)', 
      unidade: 'm', 
      prices: [
        { supplierId: 1, price: 15.00 },
        { supplierId: 3, price: 16.00 }
      ]
    },
    { 
      id: 36, 
      nome: 'Guia de Aço Galvanizado 90mm (m)', 
      unidade: 'm', 
      prices: [
        { supplierId: 1, price: 14.00 },
        { supplierId: 3, price: 14.50 }
      ]
    },
    { 
      id: 37, 
      nome: 'Placa Cimentícia 1.20x2.40m', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 95.00 },
        { supplierId: 3, price: 99.00 },
        { supplierId: 8, price: 105.00 }
      ]
    },
    { 
      id: 38, 
      nome: 'Parafuso Autobrocante (cento)', 
      unidade: 'cento', 
      prices: [
        { supplierId: 1, price: 25.00 },
        { supplierId: 2, price: 24.00 }
      ]
    }
  ],
  'Gesso Acartonado': [
    { 
      id: 39, 
      nome: 'Placa de Gesso Standard (Drywall) 1.20x1.80m', 
      unidade: 'un', 
      prices: [
        { supplierId: 5, price: 32.00 },
        { supplierId: 1, price: 33.50 },
        { supplierId: 7, price: 35.00 }
      ]
    },
    { 
      id: 40, 
      nome: 'Perfil Montante 48mm (barra 3m)', 
      unidade: 'un', 
      prices: [
        { supplierId: 5, price: 18.00 },
        { supplierId: 2, price: 17.50 }
      ]
    },
    { 
      id: 41, 
      nome: 'Massa para Drywall (balde 15kg)', 
      unidade: 'un', 
      prices: [
        { supplierId: 5, price: 70.00 },
        { supplierId: 1, price: 72.00 }
      ]
    }
  ],
  'Contra-Piso': [
    { 
      id: 42, 
      nome: 'Tela Soldada Nervurada Q61 (painel 2x3m)', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 38.00 },
        { supplierId: 4, price: 37.00 }
      ]
    }
  ],
  'Telhado': [
    { 
      id: 43, 
      nome: 'Telha Cerâmica Romana', 
      unidade: 'un', 
      prices: [
        { supplierId: 4, price: 2.50 },
        { supplierId: 1, price: 2.65 },
        { supplierId: 6, price: 2.80 }
      ]
    },
    { 
      id: 44, 
      nome: 'Telha de Fibrocimento 6mm 2.44x1.10m', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 60.00 },
        { supplierId: 2, price: 58.00 },
        { supplierId: 8, price: 62.00 }
      ]
    },
    { 
      id: 45, 
      nome: 'Manta Térmica Subcobertura (rolo 10m²)', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 120.00 },
        { supplierId: 3, price: 125.00 }
      ]
    },
    { 
      id: 46, 
      nome: 'Caibro de Madeira 5x7cm (m)', 
      unidade: 'm', 
      prices: [
        { supplierId: 4, price: 18.00 },
        { supplierId: 1, price: 19.00 }
      ]
    },
    { 
      id: 47, 
      nome: 'Ripa de Madeira 5x1.5cm (m)', 
      unidade: 'm', 
      prices: [
        { supplierId: 4, price: 5.00 },
        { supplierId: 1, price: 5.50 },
        { supplierId: 9, price: 5.80 }
      ]
    }
  ],
  'Gesso Liso': [
    { 
      id: 48, 
      nome: 'Gesso em Pó (saco 40kg)', 
      unidade: 'un', 
      prices: [
        { supplierId: 5, price: 38.00 },
        { supplierId: 1, price: 39.00 }
      ]
    }
  ],
  'Iluminação': [
    { 
      id: 49, 
      nome: 'Painel de LED Embutir 18W Quadrado', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 35.00 },
        { supplierId: 3, price: 33.00 }
      ]
    },
    { 
      id: 50, 
      nome: 'Lâmpada de LED Bulbo 9W', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 8.00 },
        { supplierId: 3, price: 7.50 },
        { supplierId: 7, price: 9.00 }
      ]
    },
    { 
      id: 51, 
      nome: 'Spot de LED 5W Redondo', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 22.00 },
        { supplierId: 3, price: 21.00 }
      ]
    }
  ],
  'Esquadrias': [
    { 
      id: 52, 
      nome: 'Janela de Alumínio Veneziana 1.20x1.00m', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 550.00 },
        { supplierId: 3, price: 540.00 },
        { supplierId: 6, price: 580.00 }
      ]
    },
    { 
      id: 53, 
      nome: 'Porta de Madeira Lisa 80x210cm', 
      unidade: 'un', 
      prices: [
        { supplierId: 4, price: 280.00 },
        { supplierId: 1, price: 290.00 }
      ]
    },
    { 
      id: 54, 
      nome: 'Vitrô Basculante de Alumínio 60x60cm', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 150.00 },
        { supplierId: 3, price: 145.00 }
      ]
    }
  ],
  'Piso Vinílico': [
    { 
      id: 55, 
      nome: 'Piso Vinílico em Régua (m²)', 
      unidade: 'm²', 
      prices: [
        { supplierId: 2, price: 85.00 },
        { supplierId: 3, price: 82.00 }
      ]
    },
    { 
      id: 56, 
      nome: 'Cola para Piso Vinílico (galão 3.6kg)', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 90.00 },
        { supplierId: 3, price: 95.00 }
      ]
    }
  ],
  'Forro de Gesso': [
    { 
      id: 57, 
      nome: 'Placa de Gesso 60x60cm', 
      unidade: 'un', 
      prices: [
        { supplierId: 5, price: 8.00 },
        { supplierId: 1, price: 8.50 }
      ]
    },
    { 
      id: 58, 
      nome: 'Arame Galvanizado nº 18 (kg)', 
      unidade: 'kg', 
      prices: [
        { supplierId: 5, price: 25.00 },
        { supplierId: 1, price: 26.00 },
        { supplierId: 8, price: 27.00 }
      ]
    },
    { 
      id: 59, 
      nome: 'Tirante para Forro (un)', 
      unidade: 'un', 
      prices: [
        { supplierId: 5, price: 1.50 },
        { supplierId: 2, price: 1.40 }
      ]
    }
  ],
  'Revestimento': [
    { 
      id: 60, 
      nome: 'Revestimento Cerâmico "Metrô White" 10x20cm (m²)', 
      unidade: 'm²', 
      prices: [
        { supplierId: 3, price: 90.00 },
        { supplierId: 2, price: 88.00 }
      ]
    },
    { 
      id: 61, 
      nome: 'Pastilha de Vidro (placa 30x30cm)', 
      unidade: 'un', 
      prices: [
        { supplierId: 3, price: 28.00 },
        { supplierId: 2, price: 27.50 }
      ]
    }
  ],
  'Louças/Pedras/Metais': [
    { 
      id: 62, 
      nome: 'Bacia Sanitária com Caixa Acoplada', 
      unidade: 'un', 
      prices: [
        { supplierId: 3, price: 450.00 },
        { supplierId: 2, price: 440.00 },
        { supplierId: 9, price: 460.00 }
      ]
    },
    { 
      id: 63, 
      nome: 'Cuba de Apoio para Banheiro', 
      unidade: 'un', 
      prices: [
        { supplierId: 3, price: 200.00 },
        { supplierId: 2, price: 195.00 }
      ]
    },
    { 
      id: 64, 
      nome: 'Torneira de Bancada Cromada', 
      unidade: 'un', 
      prices: [
        { supplierId: 3, price: 180.00 },
        { supplierId: 2, price: 175.00 }
      ]
    },
    { 
      id: 65, 
      nome: 'Pia de Granito para Cozinha (m)', 
      unidade: 'm', 
      prices: [
        { supplierId: 4, price: 350.00 },
        { supplierId: 1, price: 360.00 },
        { supplierId: 7, price: 380.00 }
      ]
    }
  ],
  'Coluna/Pilar': [
    { 
      id: 1, 
      nome: 'Cimento (saco 50kg)', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 28.00 },
        { supplierId: 6, price: 32.00 },
        { supplierId: 8, price: 31.00 }
      ]
    },
    { 
      id: 2, 
      nome: 'Areia Média (m³)', 
      unidade: 'm³', 
      prices: [
        { supplierId: 1, price: 90.00 },
        { supplierId: 7, price: 105.00 },
        { supplierId: 9, price: 108.00 }
      ]
    },
    { 
      id: 3, 
      nome: 'Brita (m³)', 
      unidade: 'm³', 
      prices: [
        { supplierId: 1, price: 100.00 },
        { supplierId: 6, price: 110.00 },
        { supplierId: 7, price: 115.00 }
      ]
    },
    { 
      id: 4, 
      nome: 'Vergalhão de Aço CA-50 10mm (barra 12m)', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 45.00 },
        { supplierId: 2, price: 44.00 },
        { supplierId: 6, price: 48.00 },
        { supplierId: 9, price: 49.00 }
      ]
    }
  ],
  'Pintura': [
    { 
      id: 5, 
      nome: 'Tinta Acrílica Branca (lata 18L)', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 250.00 },
        { supplierId: 3, price: 260.00 },
        { supplierId: 8, price: 270.00 }
      ]
    },
    { 
      id: 6, 
      nome: 'Massa Corrida (lata 25kg)', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 80.00 },
        { supplierId: 5, price: 78.00 },
        { supplierId: 7, price: 85.00 }
      ]
    },
    { 
      id: 7, 
      nome: 'Lixa para Parede (folha)', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 2.50 },
        { supplierId: 2, price: 2.40 },
        { supplierId: 9, price: 2.60 }
      ]
    },
    { 
      id: 8, 
      nome: 'Rolo de Lã', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 25.00 },
        { supplierId: 3, price: 26.00 },
        { supplierId: 6, price: 27.00 }
      ]
    }
  ],
  'Instalações Elétricas': [
    { 
      id: 9, 
      nome: 'Fio Flexível 2.5mm (rolo 100m)', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 150.00 },
        { supplierId: 8, price: 160.00 }
      ]
    },
    { 
      id: 10, 
      nome: 'Caixa de Luz 4x2', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 1.75 },
        { supplierId: 9, price: 1.90 }
      ]
    },
    { 
      id: 11, 
      nome: 'Tomada Simples', 
      unidade: 'un', 
      prices: [
        { supplierId: 2, price: 12.00 },
        { supplierId: 3, price: 11.50 },
        { supplierId: 7, price: 12.50 }
      ]
    },
    { 
      id: 12, 
      nome: 'Disjuntor Monopolar 20A', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 15.00 },
        { supplierId: 3, price: 14.00 },
        { supplierId: 6, price: 16.00 }
      ]
    }
  ],
  'Pisos': [
    { 
      id: 13, 
      nome: 'Porcelanato (m²)', 
      unidade: 'm²', 
      prices: [
        { supplierId: 3, price: 70.00 },
        { supplierId: 2, price: 68.00 }
      ]
    },
    { 
      id: 14, 
      nome: 'Argamassa ACIII (saco 20kg)', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 35.00 },
        { supplierId: 2, price: 34.00 },
        { supplierId: 8, price: 38.00 }
      ]
    },
    { 
      id: 15, 
      nome: 'Rejunte (1kg)', 
      unidade: 'un', 
      prices: [
        { supplierId: 1, price: 10.00 },
        { supplierId: 5, price: 9.50 }
      ]
    }
  ]
};

// Função para obter informações de preço baseado no plano
export const getPriceInfo = (material, plan) => {
  if (!material || !material.prices || material.prices.length === 0) {
    return { price: 0, supplierId: null, text: "" };
  }
  
  if (plan === 'basico') {
    const worstOption = material.prices.reduce((max, p) => p.price > max.price ? p : max, material.prices[0]);
    return { price: worstOption.price, supplierId: worstOption.supplierId, text: "a partir de" };
  }
  
  const bestOption = material.prices.reduce((min, p) => p.price < min.price ? p : min, material.prices[0]);
  return { price: bestOption.price, supplierId: bestOption.supplierId, text: "" };
};

// Função para obter fornecedores por estado
export const getSuppliersByState = (state) => {
  return FORNECEDORES.filter(supplier => supplier.state === state);
};

