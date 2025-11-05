import React from 'react';
import { motion } from 'framer-motion';
import { Home, Layers, Grid3X3 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const Step0BudgetType = ({ onSelectType }) => {
  const budgetModes = [
    {
      id: 'casa',
      title: 'Casa Completa',
      description: 'Orçamento para construção ou reforma completa da casa',
      icon: <Home className="h-8 w-8" />,
      color: 'green',
      features: [
        'Construção do zero',
        'Reforma completa',
        'Visão geral do projeto',
        'Todos os cômodos incluídos'
      ]
    },
    {
      id: 'etapas',
      title: 'Por Etapas',
      description: 'Orçamento focado em etapas específicas da obra',
      icon: <Layers className="h-8 w-8" />,
      color: 'blue',
      features: [
        'Estrutura (fundação, alvenaria)',
        'Acabamento (pisos, pintura)',
        'Instalações (elétrica, hidráulica)',
        'Controle por fases'
      ]
    },
    {
      id: 'comodos',
      title: 'Por Cômodos',
      description: 'Orçamento focado em cômodos específicos',
      icon: <Grid3X3 className="h-8 w-8" />,
      color: 'purple',
      features: [
        'Sala, cozinha, quartos',
        'Banheiros e lavabos',
        'Áreas externas',
        'Personalização por ambiente'
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        accent: 'text-green-600'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        accent: 'text-blue-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
        accent: 'text-purple-600'
      }
    };
    return colors[color] || colors.green;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Escolha o Modo de Orçamento
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Selecione como você quer organizar seu orçamento
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {budgetModes.map((mode, index) => {
          const colors = getColorClasses(mode.color);
          
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`p-6 h-full cursor-pointer transition-all duration-200 hover:shadow-lg ${colors.bg} ${colors.border} border-2 hover:scale-105`}
                onClick={() => onSelectType(mode.id)}
              >
                <div className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${colors.bg} ${colors.border} border-2`}>
                    <div className={colors.icon}>
                      {mode.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {mode.title}
                  </h3>
                  
                  <p className="text-secondary-600 mb-6">
                    {mode.description}
                  </p>
                  
                  <ul className="text-left space-y-2 mb-6">
                    {mode.features.map((feature, featureIndex) => (
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
                      onSelectType(mode.id);
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

      <div className="text-center">
        <p className="text-sm text-secondary-500">
          Você pode alterar o modo de orçamento a qualquer momento durante a criação
        </p>
      </div>
    </motion.div>
  );
};

export default Step0BudgetType;