// Estados brasileiros
export const ESTADOS = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

// Cidades por estado
export const CIDADES = {
  AC: ['Rio Branco', 'Cruzeiro do Sul'],
  AL: ['Maceió', 'Arapiraca'],
  AP: ['Macapá', 'Santana'],
  AM: ['Manaus', 'Parintins'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
  CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte'],
  DF: ['Brasília'],
  ES: ['Vitória', 'Vila Velha', 'Serra'],
  GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis'],
  MA: ['São Luís', 'Imperatriz'],
  MT: ['Cuiabá', 'Várzea Grande'],
  MS: ['Campo Grande', 'Dourados'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem'],
  PA: ['Belém', 'Ananindeua', 'Santarém'],
  PB: ['João Pessoa', 'Campina Grande'],
  PR: ['Curitiba', 'Londrina', 'Maringá'],
  PE: ['Recife', 'Jaboatão dos Guararapes'],
  PI: ['Teresina', 'Parnaíba'],
  RJ: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias'],
  RN: ['Natal', 'Mossoró'],
  RS: ['Porto Alegre', 'Caxias do Sul'],
  RO: ['Porto Velho', 'Ji-Paraná'],
  RR: ['Boa Vista'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau'],
  SP: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo'],
  SE: ['Aracaju', 'Nossa Senhora do Socorro'],
  TO: ['Palmas', 'Araguaína']
};

// Tipos de obra
export const TIPOS_OBRA = [
  'Residencial',
  'Comercial', 
  'Reforma',
  'Industrial'
];

// Etapas da obra
export const ETAPAS_OBRA = [
  'Muro',
  'Radier',
  'Baldrame',
  'Coluna/Pilar',
  'Viga',
  'Laje',
  'Bloco Estrutural',
  'Bloco Cerâmico',
  'Tijolo Maciço',
  'Steel Frame',
  'Gesso Acartonado',
  'Reboco',
  'Instalações Elétricas',
  'Contra-Piso',
  'Telhado',
  'Gesso Liso',
  'Iluminação',
  'Esquadrias',
  'Piso Vinílico',
  'Forro de Gesso',
  'Pisos',
  'Revestimento',
  'Louças/Pedras/Metais',
  'Pintura',
  'Hidrossanitárias'
];

// Planos disponíveis
export const PLANOS = [
  {
    id: 'basico',
    name: 'Básico',
    price: 'Grátis',
    description: 'Funcionalidades essenciais',
    features: [
      'Até 3 orçamentos',
      'Materiais básicos',
      'Cálculos automáticos',
      'Suporte por email'
    ],
    limitations: [
      'Preços limitados',
      'Sem exportação PDF',
      'Sem fornecedores'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 29,90/mês',
    description: 'Para profissionais autônomos',
    features: [
      'Orçamentos ilimitados',
      'Todos os materiais',
      'Lista de fornecedores',
      'Exportação PDF',
      'Favoritos',
      'Suporte prioritário'
    ],
    limitations: []
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    price: 'R$ 99,90/mês',
    description: 'Para construtoras e escritórios',
    features: [
      'Todas as funcionalidades Pro',
      'Assinatura digital',
      'Envio por email/WhatsApp',
      'Relatórios avançados',
      'Suporte telefônico',
      'API personalizada'
    ],
    limitations: []
  }
];

// Limites por plano (null = ilimitado)
export const PLAN_LIMITS = {
  basico: 3,
  pro: null,
  empresarial: null,
};

export const UPGRADE_MESSAGES = {
  export_pdf_blocked: 'Exportação em PDF disponível apenas nos planos Pro e Empresarial.',
  suppliers_blocked: 'Acesso a fornecedores disponível apenas nos planos Pro e Empresarial.',
};
// Fornecedores mock
export const FORNECEDORES = [
  { id: 1, name: 'Depósito São Paulo', state: 'SP', city: 'São Paulo' },
  { id: 2, name: 'Construtudo Campinas', state: 'SP', city: 'Campinas' },
  { id: 3, name: 'Obra & Cia Carioca', state: 'RJ', city: 'Rio de Janeiro' },
  { id: 4, name: 'Rei do Tijolo BH', state: 'MG', city: 'Belo Horizonte' },
  { id: 5, name: 'Tudo Gesso Nacional', state: 'SP', city: 'São Paulo' },
  { id: 6, name: 'Rei da Obra Cuiabá', state: 'MT', city: 'Cuiabá' },
  { id: 7, name: 'Constrói Bem Várzea Grande', state: 'MT', city: 'Várzea Grande' },
  { id: 8, name: 'Cuiabá Materiais', state: 'MT', city: 'Cuiabá' },
  { id: 9, name: 'V.G. Construções', state: 'MT', city: 'Várzea Grande' }
];

