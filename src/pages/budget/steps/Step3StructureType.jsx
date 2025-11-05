import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Layers, Home, Building2, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

const Step2StructureType = ({ data, onChange, onNext, onBack, budgetMode }) => {
  const handleSelectOption = (option) => {
    const newStructure = {
      ...data,
      selectedOption: option
    };
    onChange(newStructure);
    onNext();
  };

  // Opções baseadas no modo selecionado
  const getOptions = () => {
    switch (budgetMode) {
      case 'casa':
        return [
          {
            id: 'casa-nova',
            title: 'Casa Nova',
            description: 'Construção completa do zero',
            icon: <Home className="h-8 w-8" />,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            borderColor: 'border-green-200'
          },
          {
            id: 'reforma-completa',
            title: 'Reforma Completa',
            description: 'Reforma total da casa existente',
            icon: <Building2 className="h-8 w-8" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            borderColor: 'border-blue-200'
          }
        ];
      
      case 'etapas':
        return [
          {
            id: 'estrutura',
            title: 'Estrutura',
            description: 'Fundação, alvenaria, lajes',
            icon: <Layers className="h-8 w-8" />,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            borderColor: 'border-orange-200'
          },
          {
            id: 'acabamento',
            title: 'Acabamento',
            description: 'Pisos, pintura, revestimentos',
            icon: <CheckCircle className="h-8 w-8" />,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            borderColor: 'border-purple-200'
          },
          {
            id: 'instalacoes',
            title: 'Instalações',
            description: 'Elétrica, hidráulica, gás',
            icon: <Building2 className="h-8 w-8" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            borderColor: 'border-blue-200'
          }
        ];
      
      case 'comodos':
        return [
          {
            id: 'sala',
            title: 'Sala',
            description: 'Sala de estar e jantar',
            icon: <Home className="h-8 w-8" />,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            borderColor: 'border-green-200'
          },
          {
            id: 'cozinha',
            title: 'Cozinha',
            description: 'Cozinha completa',
            icon: <Building2 className="h-8 w-8" />,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            borderColor: 'border-orange-200'
          },
          {
            id: 'quarto',
            title: 'Quarto',
            description: 'Dormitórios',
            icon: <Layers className="h-8 w-8" />,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            borderColor: 'border-purple-200'
          },
          {
            id: 'banheiro',
            title: 'Banheiro',
            description: 'Banheiros e lavabos',
            icon: <CheckCircle className="h-8 w-8" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            borderColor: 'border-blue-200'
          }
        ];
      
      default:
        return [];
    }
  };

  const options = getOptions();

  const getTitle = () => {
    switch (budgetMode) {
      case 'casa':
        return 'Tipo de Construção';
      case 'etapas':
        return 'Selecione as Etapas';
      case 'comodos':
        return 'Selecione os Cômodos';
      default:
        return 'Selecione uma Opção';
    }
  };

  const getDescription = () => {
    switch (budgetMode) {
      case 'casa':
        return 'Escolha o tipo de construção para sua casa';
      case 'etapas':
        return 'Selecione as etapas que serão incluídas no orçamento';
      case 'comodos':
        return 'Selecione os cômodos que serão incluídos no orçamento';
      default:
        return 'Escolha uma opção para continuar';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          {getTitle()}
        </h2>
        <p className="text-secondary-600">
          {getDescription()}
        </p>
      </div>

      <div className={`grid gap-6 max-w-4xl mx-auto ${
        budgetMode === 'comodos' ? 'md:grid-cols-2' : 'md:grid-cols-3'
      }`}>
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${option.borderColor} border-2`}
              onClick={() => handleSelectOption(option.id)}
            >
              <div className="text-center space-y-4">
                <div className={`mx-auto w-16 h-16 ${option.bgColor} rounded-full flex items-center justify-center`}>
                  <div className={option.color}>
                    {option.icon}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-secondary-600 text-sm">
                    {option.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Botões */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    </motion.div>
  );
};

export default Step2StructureType;