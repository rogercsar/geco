import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Package, Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import AddServiceModal from '../../../components/ui/AddServiceModal';

const Step3Stages = ({ data, onChange, onNext, onBack, budgetMode, budgetType }) => {
  const [selectedItems, setSelectedItems] = useState(data.materials || data.labor || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customItems, setCustomItems] = useState(data.customItems || []);

  const handleToggleItem = (item) => {
    const newItems = selectedItems.includes(item)
      ? selectedItems.filter(m => m !== item)
      : [...selectedItems, item];
    
    setSelectedItems(newItems);
    if (budgetType === 'labor') {
      onChange({ ...data, labor: newItems });
    } else {
      onChange({ ...data, materials: newItems });
    }
  };

  const handleNext = () => {
    if (selectedItems.length > 0) {
      onNext();
    }
  };

  const handleAddService = (newService) => {
    const updatedCustomItems = [...customItems, newService];
    setCustomItems(updatedCustomItems);
    onChange({ ...data, customItems: updatedCustomItems });
  };

  // Serviços baseados na seleção
  const getServices = () => {
    const selectedOption = data.structure?.selectedOption;
    
    switch (budgetMode) {
      case 'casa':
        return [
          { id: 'fundacao', name: 'Fundação', category: 'Estrutural', price: 150.00, unit: 'm²' },
          { id: 'alvenaria', name: 'Alvenaria', category: 'Estrutural', price: 120.00, unit: 'm²' },
          { id: 'laje', name: 'Laje', category: 'Estrutural', price: 180.00, unit: 'm²' },
          { id: 'cobertura', name: 'Cobertura', category: 'Estrutural', price: 200.00, unit: 'm²' },
          { id: 'instalacao-eletrica', name: 'Instalação Elétrica', category: 'Instalações', price: 45.00, unit: 'm²' },
          { id: 'instalacao-hidraulica', name: 'Instalação Hidráulica', category: 'Instalações', price: 60.00, unit: 'm²' },
          { id: 'acabamento-piso', name: 'Acabamento de Piso', category: 'Acabamento', price: 80.00, unit: 'm²' },
          { id: 'pintura', name: 'Pintura', category: 'Acabamento', price: 25.00, unit: 'm²' },
          { id: 'azulejamento', name: 'Azulejamento', category: 'Acabamento', price: 70.00, unit: 'm²' },
          { id: 'gesso', name: 'Aplicação de Gesso', category: 'Acabamento', price: 40.00, unit: 'm²' }
        ];
      
      case 'etapas':
        switch (selectedOption) {
          case 'estrutura':
            return [
              { id: 'fundacao', name: 'Fundação', category: 'Estrutural', price: 150.00, unit: 'm²' },
              { id: 'alvenaria', name: 'Alvenaria', category: 'Estrutural', price: 120.00, unit: 'm²' },
              { id: 'laje', name: 'Laje', category: 'Estrutural', price: 180.00, unit: 'm²' },
              { id: 'cobertura', name: 'Cobertura', category: 'Estrutural', price: 200.00, unit: 'm²' }
            ];
          case 'acabamento':
            return [
              { id: 'acabamento-piso', name: 'Acabamento de Piso', category: 'Acabamento', price: 80.00, unit: 'm²' },
              { id: 'pintura', name: 'Pintura', category: 'Acabamento', price: 25.00, unit: 'm²' },
              { id: 'azulejamento', name: 'Azulejamento', category: 'Acabamento', price: 70.00, unit: 'm²' },
              { id: 'gesso', name: 'Aplicação de Gesso', category: 'Acabamento', price: 40.00, unit: 'm²' }
            ];
          case 'instalacoes':
            return [
              { id: 'instalacao-eletrica', name: 'Instalação Elétrica', category: 'Elétrica', price: 45.00, unit: 'm²' },
              { id: 'instalacao-hidraulica', name: 'Instalação Hidráulica', category: 'Hidráulica', price: 60.00, unit: 'm²' },
              { id: 'instalacao-gas', name: 'Instalação de Gás', category: 'Hidráulica', price: 50.00, unit: 'm²' }
            ];
          default:
            return [];
        }
      
      case 'comodos':
        switch (selectedOption) {
          case 'sala':
            return [
              { id: 'acabamento-piso-sala', name: 'Acabamento de Piso', category: 'Piso', price: 80.00, unit: 'm²' },
              { id: 'pintura-sala', name: 'Pintura', category: 'Pintura', price: 25.00, unit: 'm²' },
              { id: 'instalacao-eletrica-sala', name: 'Instalação Elétrica', category: 'Elétrica', price: 45.00, unit: 'm²' }
            ];
          case 'cozinha':
            return [
              { id: 'azulejamento-cozinha', name: 'Azulejamento', category: 'Revestimento', price: 70.00, unit: 'm²' },
              { id: 'instalacao-hidraulica-cozinha', name: 'Instalação Hidráulica', category: 'Hidráulica', price: 60.00, unit: 'm²' },
              { id: 'instalacao-eletrica-cozinha', name: 'Instalação Elétrica', category: 'Elétrica', price: 45.00, unit: 'm²' }
            ];
          case 'quarto':
            return [
              { id: 'acabamento-piso-quarto', name: 'Acabamento de Piso', category: 'Piso', price: 80.00, unit: 'm²' },
              { id: 'pintura-quarto', name: 'Pintura', category: 'Pintura', price: 25.00, unit: 'm²' },
              { id: 'instalacao-eletrica-quarto', name: 'Instalação Elétrica', category: 'Elétrica', price: 45.00, unit: 'm²' }
            ];
          case 'banheiro':
            return [
              { id: 'azulejamento-banheiro', name: 'Azulejamento', category: 'Revestimento', price: 70.00, unit: 'm²' },
              { id: 'instalacao-hidraulica-banheiro', name: 'Instalação Hidráulica', category: 'Hidráulica', price: 60.00, unit: 'm²' },
              { id: 'instalacao-eletrica-banheiro', name: 'Instalação Elétrica', category: 'Elétrica', price: 45.00, unit: 'm²' }
            ];
          default:
            return [];
        }
      
      default:
        return [];
    }
  };

  // Materiais baseados na seleção
  const getMaterials = () => {
    const selectedOption = data.structure?.selectedOption;
    
    switch (budgetMode) {
      case 'casa':
        return [
          { id: 'cimento', name: 'Cimento', category: 'Básico', price: 25.50, unit: 'saco' },
          { id: 'areia', name: 'Areia', category: 'Básico', price: 85.00, unit: 'm³' },
          { id: 'brita', name: 'Brita', category: 'Básico', price: 95.00, unit: 'm³' },
          { id: 'tijolo', name: 'Tijolo', category: 'Básico', price: 450.00, unit: 'milheiro' },
          { id: 'ferro', name: 'Ferro', category: 'Estrutural', price: 8.50, unit: 'kg' },
          { id: 'madeira', name: 'Madeira', category: 'Estrutural', price: 1200.00, unit: 'm³' },
          { id: 'telha', name: 'Telha', category: 'Cobertura', price: 12.50, unit: 'unidade' },
          { id: 'piso', name: 'Piso', category: 'Acabamento', price: 45.00, unit: 'm²' },
          { id: 'tinta', name: 'Tinta', category: 'Acabamento', price: 85.00, unit: 'galão' },
          { id: 'azulejo', name: 'Azulejo', category: 'Acabamento', price: 35.00, unit: 'm²' }
        ];
      
      case 'etapas':
        switch (selectedOption) {
          case 'estrutura':
            return [
              { id: 'cimento', name: 'Cimento', category: 'Básico', price: 25.50, unit: 'saco' },
              { id: 'areia', name: 'Areia', category: 'Básico', price: 85.00, unit: 'm³' },
              { id: 'brita', name: 'Brita', category: 'Básico', price: 95.00, unit: 'm³' },
              { id: 'tijolo', name: 'Tijolo', category: 'Básico', price: 450.00, unit: 'milheiro' },
              { id: 'ferro', name: 'Ferro', category: 'Estrutural', price: 8.50, unit: 'kg' },
              { id: 'madeira', name: 'Madeira', category: 'Estrutural', price: 1200.00, unit: 'm³' }
            ];
          case 'acabamento':
            return [
              { id: 'piso', name: 'Piso', category: 'Acabamento', price: 45.00, unit: 'm²' },
              { id: 'tinta', name: 'Tinta', category: 'Acabamento', price: 85.00, unit: 'galão' },
              { id: 'azulejo', name: 'Azulejo', category: 'Acabamento', price: 35.00, unit: 'm²' },
              { id: 'gesso', name: 'Gesso', category: 'Acabamento', price: 15.00, unit: 'kg' },
              { id: 'rejunte', name: 'Rejunte', category: 'Acabamento', price: 8.50, unit: 'kg' }
            ];
          case 'instalacoes':
            return [
              { id: 'fio', name: 'Fio Elétrico', category: 'Elétrica', price: 3.50, unit: 'metro' },
              { id: 'cano', name: 'Cano PVC', category: 'Hidráulica', price: 12.00, unit: 'metro' },
              { id: 'luminaria', name: 'Luminária', category: 'Elétrica', price: 45.00, unit: 'unidade' },
              { id: 'torneira', name: 'Torneira', category: 'Hidráulica', price: 85.00, unit: 'unidade' },
              { id: 'interruptor', name: 'Interruptor', category: 'Elétrica', price: 12.50, unit: 'unidade' }
            ];
          default:
            return [];
        }
      
      case 'comodos':
        switch (selectedOption) {
          case 'sala':
            return [
              { id: 'piso-sala', name: 'Piso Laminado', category: 'Piso', price: 45.00, unit: 'm²' },
              { id: 'tinta-sala', name: 'Tinta Acrílica', category: 'Pintura', price: 85.00, unit: 'galão' },
              { id: 'rodape', name: 'Rodapé', category: 'Acabamento', price: 12.50, unit: 'metro' },
              { id: 'luminaria-sala', name: 'Luminária de Teto', category: 'Iluminação', price: 120.00, unit: 'unidade' }
            ];
          case 'cozinha':
            return [
              { id: 'azulejo-cozinha', name: 'Azulejo', category: 'Revestimento', price: 35.00, unit: 'm²' },
              { id: 'granito', name: 'Granito', category: 'Bancada', price: 180.00, unit: 'm²' },
              { id: 'torneira-cozinha', name: 'Torneira', category: 'Hidráulica', price: 85.00, unit: 'unidade' },
              { id: 'pia', name: 'Pia', category: 'Hidráulica', price: 250.00, unit: 'unidade' }
            ];
          case 'quarto':
            return [
              { id: 'piso-quarto', name: 'Piso Vinílico', category: 'Piso', price: 35.00, unit: 'm²' },
              { id: 'tinta-quarto', name: 'Tinta Latex', category: 'Pintura', price: 75.00, unit: 'galão' },
              { id: 'luminaria-quarto', name: 'Luminária de Mesa', category: 'Iluminação', price: 65.00, unit: 'unidade' },
              { id: 'tomada', name: 'Tomada', category: 'Elétrica', price: 8.50, unit: 'unidade' }
            ];
          case 'banheiro':
            return [
              { id: 'azulejo-banheiro', name: 'Azulejo', category: 'Revestimento', price: 35.00, unit: 'm²' },
              { id: 'box', name: 'Box de Vidro', category: 'Vedação', price: 450.00, unit: 'unidade' },
              { id: 'vaso', name: 'Vaso Sanitário', category: 'Sanitário', price: 180.00, unit: 'unidade' },
              { id: 'chuveiro', name: 'Chuveiro', category: 'Hidráulica', price: 95.00, unit: 'unidade' }
            ];
          default:
            return [];
        }
      
      default:
        return [];
    }
  };

  const baseItems = budgetType === 'labor' ? getServices() : getMaterials();
  const items = [...baseItems, ...customItems];

  const getTitle = () => {
    const itemType = budgetType === 'labor' ? 'Serviços' : 'Materiais';
    switch (budgetMode) {
      case 'casa':
        return `${itemType} para Construção`;
      case 'etapas':
        return `${itemType} para ${data.structure?.selectedOption}`;
      case 'comodos':
        return `${itemType} para ${data.structure?.selectedOption}`;
      default:
        return `Selecione os ${itemType}`;
    }
  };

  const getDescription = () => {
    const itemType = budgetType === 'labor' ? 'serviços' : 'materiais';
    switch (budgetMode) {
      case 'casa':
        return `Selecione todos os ${itemType} necessários para a construção completa`;
      case 'etapas':
        return `Selecione os ${itemType} necessários para a etapa de ${data.structure?.selectedOption}`;
      case 'comodos':
        return `Selecione os ${itemType} necessários para o ${data.structure?.selectedOption}`;
      default:
        return `Escolha os ${itemType} que serão incluídos no orçamento`;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
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
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
            {selectedItems.length} {budgetType === 'labor' ? 'serviço' : 'material'}{selectedItems.length !== 1 ? 's' : ''} selecionado{selectedItems.length !== 1 ? 's' : ''}
          </span>
          
          {budgetType === 'labor' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Serviço</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const isSelected = selectedItems.includes(item.id);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-primary-25'
                }`}
                onClick={() => handleToggleItem(item.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-secondary-300'
                  }`}>
                    {isSelected && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Package className="h-4 w-4 text-secondary-400" />
                      <h3 className="font-medium text-secondary-900 truncate">
                        {item.name}
                      </h3>
                      {item.isCustom && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Personalizado
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-secondary-600">
                        Categoria: {item.category}
                      </p>
                      <p className="text-sm text-secondary-600">
                        Preço: {formatPrice(item.price)} / {item.unit}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-secondary-400" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Nenhum {budgetType === 'labor' ? 'serviço' : 'material'} disponível
          </h3>
          <p className="text-secondary-500">
            Não há {budgetType === 'labor' ? 'serviços' : 'materiais'} disponíveis para a seleção atual.
          </p>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={selectedItems.length === 0}
        >
          Continuar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Modal para adicionar serviço */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddService={handleAddService}
        budgetMode={budgetMode}
        selectedOption={data.structure?.selectedOption}
      />
    </motion.div>
  );
};

export default Step3Stages;