import React from 'react';
import { motion } from 'framer-motion';
import { Package, Users, Calculator, ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const Step1BudgetType = ({ budgetMode, onSelectType, onBack }) => {
  const getBudgetTypes = () => {
    switch (budgetMode) {
      case 'casa':
        return [
          {
            id: 'materials',
            title: 'Materiais para Casa',
            description: 'Orçamento focado em materiais para construção completa',
            icon: <Package className="h-8 w-8" />,
            color: 'blue',
            features: [
              'Materiais estruturais',
              'Materiais de acabamento',
              'Instalações elétricas e hidráulicas',
              'Cobertura e impermeabilização'
            ]
          },
          {
            id: 'labor',
            title: 'Mão de Obra para Casa',
            description: 'Orçamento focado em serviços para construção completa',
            icon: <Users className="h-8 w-8" />,
            color: 'green',
            features: [
              'Serviços de construção',
              'Instalações especializadas',
              'Acabamentos e pintura',
              'Supervisão e coordenação'
            ]
          },
          {
            id: 'combined',
            title: 'Casa Completa',
            description: 'Materiais + Mão de obra para construção completa',
            icon: <Calculator className="h-8 w-8" />,
            color: 'purple',
            features: [
              'Todos os materiais necessários',
              'Toda a mão de obra especializada',
              'Visão completa do investimento',
              'Relatórios detalhados'
            ]
          }
        ];
      
      case 'etapas':
        return [
          {
            id: 'materials',
            title: 'Materiais por Etapa',
            description: 'Orçamento de materiais para etapas específicas',
            icon: <Package className="h-8 w-8" />,
            color: 'blue',
            features: [
              'Materiais por fase da obra',
              'Controle de estoque por etapa',
              'Fornecedores especializados',
              'Cronograma de entregas'
            ]
          },
          {
            id: 'labor',
            title: 'Mão de Obra por Etapa',
            description: 'Orçamento de serviços para etapas específicas',
            icon: <Users className="h-8 w-8" />,
            color: 'green',
            features: [
              'Profissionais por especialidade',
              'Cronograma de execução',
              'Controle de qualidade',
              'Acompanhamento de progresso'
            ]
          },
          {
            id: 'combined',
            title: 'Etapa Completa',
            description: 'Materiais + Mão de obra por etapa',
            icon: <Calculator className="h-8 w-8" />,
            color: 'purple',
            features: [
              'Custo total por etapa',
              'Materiais e serviços integrados',
              'Planejamento detalhado',
              'Controle de orçamento'
            ]
          }
        ];
      
      case 'comodos':
        return [
          {
            id: 'materials',
            title: 'Materiais por Cômodo',
            description: 'Orçamento de materiais para cômodos específicos',
            icon: <Package className="h-8 w-8" />,
            color: 'blue',
            features: [
              'Materiais específicos por ambiente',
              'Acabamentos personalizados',
              'Revestimentos e pisos',
              'Iluminação e decoração'
            ]
          },
          {
            id: 'labor',
            title: 'Mão de Obra por Cômodo',
            description: 'Orçamento de serviços para cômodos específicos',
            icon: <Users className="h-8 w-8" />,
            color: 'green',
            features: [
              'Especialistas por ambiente',
              'Instalações específicas',
              'Acabamentos personalizados',
              'Projetos sob medida'
            ]
          },
          {
            id: 'combined',
            title: 'Cômodo Completo',
            description: 'Materiais + Mão de obra por cômodo',
            icon: <Calculator className="h-8 w-8" />,
            color: 'purple',
            features: [
              'Ambiente totalmente finalizado',
              'Materiais e serviços integrados',
              'Projeto personalizado',
              'Valor total por ambiente'
            ]
          }
        ];
      
      default:
        return [];
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        accent: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        accent: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
        accent: 'text-purple-600'
      }
    };
    return colors[color] || colors.blue;
  };

  const getModeTitle = () => {
    switch (budgetMode) {
      case 'casa':
        return 'Casa Completa';
      case 'etapas':
        return 'Por Etapas';
      case 'comodos':
        return 'Por Cômodos';
      default:
        return 'Orçamento';
    }
  };

  const budgetTypes = getBudgetTypes();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Escolha o Tipo de Orçamento
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Para <span className="font-semibold text-primary-600">{getModeTitle()}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {budgetTypes.map((type, index) => {
          const colors = getColorClasses(type.color);
          
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`p-6 h-full cursor-pointer transition-all duration-200 hover:shadow-lg ${colors.bg} ${colors.border} border-2 hover:scale-105`}
                onClick={() => onSelectType(type.id)}
              >
                <div className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${colors.bg} ${colors.border} border-2`}>
                    <div className={colors.icon}>
                      {type.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {type.title}
                  </h3>
                  
                  <p className="text-secondary-600 mb-6">
                    {type.description}
                  </p>
                  
                  <ul className="text-left space-y-2 mb-6">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-secondary-600">
                        <div className={`w-2 h-2 rounded-full mr-3 ${colors.accent} bg-current`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${colors.button} text-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectType(type.id);
                    }}
                  >
                    Selecionar
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Botões */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          size="lg"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    </motion.div>
  );
};

export default Step1BudgetType;
