import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Plus, Minus, Package, Building2, Crown, Heart, Star } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import SuppliersModal from '../../../components/ui/SuppliersModal';
import UpgradeModal from '../../../components/ui/UpgradeModal';
import { formatCurrency } from '../../../utils/format';
import { canAccessSuppliers } from '../../../utils/planGuard';
import { showUpgradeToast } from '../../../utils/upgradeToast';
import { UPGRADE_MESSAGES } from '../../../data/constants';

const Step4Materials = ({ data, onChange, onNext, onBack, currentUser, budgetMode }) => {
  const [materiais, setMateriais] = useState(data.materiais || {});
  const [quantidades, setQuantidades] = useState(data.quantidades || {});
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Materiais baseados na seleção do Step3
  const getSelectedMaterials = () => {
    const selectedMaterialIds = data.materials || [];
    
    const allMaterials = {
      // Casa
      'cimento': { id: 'cimento', name: 'Cimento', category: 'Básico', price: 25.50, unit: 'saco' },
      'areia': { id: 'areia', name: 'Areia', category: 'Básico', price: 85.00, unit: 'm³' },
      'brita': { id: 'brita', name: 'Brita', category: 'Básico', price: 95.00, unit: 'm³' },
      'tijolo': { id: 'tijolo', name: 'Tijolo', category: 'Básico', price: 450.00, unit: 'milheiro' },
      'ferro': { id: 'ferro', name: 'Ferro', category: 'Estrutural', price: 8.50, unit: 'kg' },
      'madeira': { id: 'madeira', name: 'Madeira', category: 'Estrutural', price: 1200.00, unit: 'm³' },
      'telha': { id: 'telha', name: 'Telha', category: 'Cobertura', price: 12.50, unit: 'unidade' },
      'piso': { id: 'piso', name: 'Piso', category: 'Acabamento', price: 45.00, unit: 'm²' },
      'tinta': { id: 'tinta', name: 'Tinta', category: 'Acabamento', price: 85.00, unit: 'galão' },
      'azulejo': { id: 'azulejo', name: 'Azulejo', category: 'Acabamento', price: 35.00, unit: 'm²' },
      'gesso': { id: 'gesso', name: 'Gesso', category: 'Acabamento', price: 15.00, unit: 'kg' },
      'rejunte': { id: 'rejunte', name: 'Rejunte', category: 'Acabamento', price: 8.50, unit: 'kg' },
      'fio': { id: 'fio', name: 'Fio Elétrico', category: 'Elétrica', price: 3.50, unit: 'metro' },
      'cano': { id: 'cano', name: 'Cano PVC', category: 'Hidráulica', price: 12.00, unit: 'metro' },
      'luminaria': { id: 'luminaria', name: 'Luminária', category: 'Elétrica', price: 45.00, unit: 'unidade' },
      'torneira': { id: 'torneira', name: 'Torneira', category: 'Hidráulica', price: 85.00, unit: 'unidade' },
      'interruptor': { id: 'interruptor', name: 'Interruptor', category: 'Elétrica', price: 12.50, unit: 'unidade' },
      'piso-sala': { id: 'piso-sala', name: 'Piso Laminado', category: 'Piso', price: 45.00, unit: 'm²' },
      'tinta-sala': { id: 'tinta-sala', name: 'Tinta Acrílica', category: 'Pintura', price: 85.00, unit: 'galão' },
      'rodape': { id: 'rodape', name: 'Rodapé', category: 'Acabamento', price: 12.50, unit: 'metro' },
      'luminaria-sala': { id: 'luminaria-sala', name: 'Luminária de Teto', category: 'Iluminação', price: 120.00, unit: 'unidade' },
      'azulejo-cozinha': { id: 'azulejo-cozinha', name: 'Azulejo', category: 'Revestimento', price: 35.00, unit: 'm²' },
      'granito': { id: 'granito', name: 'Granito', category: 'Bancada', price: 180.00, unit: 'm²' },
      'torneira-cozinha': { id: 'torneira-cozinha', name: 'Torneira', category: 'Hidráulica', price: 85.00, unit: 'unidade' },
      'pia': { id: 'pia', name: 'Pia', category: 'Hidráulica', price: 250.00, unit: 'unidade' },
      'piso-quarto': { id: 'piso-quarto', name: 'Piso Vinílico', category: 'Piso', price: 35.00, unit: 'm²' },
      'tinta-quarto': { id: 'tinta-quarto', name: 'Tinta Latex', category: 'Pintura', price: 75.00, unit: 'galão' },
      'luminaria-quarto': { id: 'luminaria-quarto', name: 'Luminária de Mesa', category: 'Iluminação', price: 65.00, unit: 'unidade' },
      'tomada': { id: 'tomada', name: 'Tomada', category: 'Elétrica', price: 8.50, unit: 'unidade' },
      'azulejo-banheiro': { id: 'azulejo-banheiro', name: 'Azulejo', category: 'Revestimento', price: 35.00, unit: 'm²' },
      'box': { id: 'box', name: 'Box de Vidro', category: 'Vedação', price: 450.00, unit: 'unidade' },
      'vaso': { id: 'vaso', name: 'Vaso Sanitário', category: 'Sanitário', price: 180.00, unit: 'unidade' },
      'chuveiro': { id: 'chuveiro', name: 'Chuveiro', category: 'Hidráulica', price: 95.00, unit: 'unidade' }
    };

    // Remover duplicatas e filtrar materiais válidos
    const uniqueIds = [...new Set(selectedMaterialIds)];
    return uniqueIds.map(id => allMaterials[id]).filter(Boolean);
  };

  const selectedMaterials = getSelectedMaterials();

  const handleQuantityChange = (materialId, quantity) => {
    const newQuantidades = { ...quantidades, [materialId]: quantity };
    setQuantidades(newQuantidades);
    onChange({ ...data, quantidades: newQuantidades });
  };

  const handleViewSuppliers = (material) => {
    if (canAccessSuppliers(currentUser)) {
      setSelectedMaterial(material);
      setShowSuppliersModal(true);
    } else {
      showUpgradeToast(null, () => setShowUpgradeModal(true), 8000, UPGRADE_MESSAGES.suppliers_blocked, 'info');
    }
  };

  const handleAddToBudget = (materialWithSupplier) => {
    // Atualizar apenas o fornecedor e quantidade do material existente
    const newQuantidades = { ...quantidades, [materialWithSupplier.id]: materialWithSupplier.quantity };
    
    setQuantidades(newQuantidades);
    onChange({ 
      ...data, 
      quantidades: newQuantidades,
      suppliers: {
        ...data.suppliers,
        [materialWithSupplier.id]: materialWithSupplier.supplier
      }
    });
  };

  const handleToggleFavorite = (material) => {
    const isFavorite = favorites.some(fav => fav.id === material.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== material.id));
    } else {
      setFavorites([...favorites, {
        id: material.id,
        name: material.name,
        category: material.category,
        price: material.price,
        unit: material.unit,
        type: 'material',
        addedDate: new Date().toISOString().split('T')[0]
      }]);
    }
  };

  const totalValue = useMemo(() => {
    return selectedMaterials.reduce((total, material) => {
      const quantity = quantidades[material.id] || 0;
      return total + (material.price * quantity);
    }, 0);
  }, [selectedMaterials, quantidades]);

  const getTitle = () => {
    switch (budgetMode) {
      case 'casa':
        return 'Quantidades dos Materiais';
      case 'etapas':
        return `Quantidades - ${data.structure?.selectedOption}`;
      case 'comodos':
        return `Quantidades - ${data.structure?.selectedOption}`;
      default:
        return 'Defina as Quantidades';
    }
  };

  const getDescription = () => {
    switch (budgetMode) {
      case 'casa':
        return 'Defina as quantidades necessárias para cada material';
      case 'etapas':
        return `Defina as quantidades para os materiais de ${data.structure?.selectedOption}`;
      case 'comodos':
        return `Defina as quantidades para os materiais do ${data.structure?.selectedOption}`;
      default:
        return 'Especifique as quantidades de cada material';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          {getTitle()}
        </h2>
        <p className="text-secondary-600">
          {getDescription()}
        </p>
      </div>

      {/* Resumo do Total */}
      <Card className="p-4 sm:p-6 bg-primary-50 border-primary-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-primary-900">
                Total do Orçamento
              </h3>
              <p className="text-xs sm:text-sm text-primary-700">
                {selectedMaterials.length} material{selectedMaterials.length !== 1 ? 'is' : ''} selecionado{selectedMaterials.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-2xl sm:text-3xl font-bold text-primary-900">
              {formatCurrency(totalValue)}
            </p>
            <p className="text-xs sm:text-sm text-primary-700">
              Valor total
            </p>
          </div>
        </div>
      </Card>

      {/* Lista de Materiais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {selectedMaterials.map((material, index) => {
          const quantity = quantidades[material.id] || 0;
          const subtotal = material.price * quantity;
          
          return (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 sm:p-6 h-full">
                <div className="flex flex-col h-full">
                  {/* Header do Material */}
                  <div className="flex items-start sm:items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-400 flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-semibold text-secondary-900 truncate">
                        {material.name}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(material)}
                        className={`h-6 w-6 sm:h-7 sm:w-7 p-0 ${
                          favorites.some(fav => fav.id === material.id)
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-secondary-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          favorites.some(fav => fav.id === material.id) ? 'fill-current' : ''
                        }`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSuppliers(material)}
                        className="text-xs h-6 sm:h-7 px-2 sm:px-3 hover:bg-primary-50 hover:border-primary-300"
                      >
                        {currentUser?.plano === 'pro' || currentUser?.plano === 'empresarial' ? (
                          <>
                            <Building2 className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Fornecedores</span>
                            <span className="sm:hidden">Fornec.</span>
                          </>
                        ) : (
                          <>
                            <Crown className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Ver Empresas</span>
                            <span className="sm:hidden">Empresas</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Informações do Material */}
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-secondary-600 mb-3 sm:mb-4">
                    <span className="truncate">Categoria: {material.category}</span>
                    <span className="truncate">Preço: {formatCurrency(material.price)} / {material.unit}</span>
                  </div>
                  
                  {/* Controles e Subtotal */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-auto space-y-3 sm:space-y-0">
                    {/* Controle de Quantidade */}
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(material.id, Math.max(0, quantity - 1))}
                        disabled={quantity <= 0}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(material.id, parseInt(e.target.value) || 0)}
                        className="w-16 sm:w-20 text-center text-sm"
                        min="0"
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(material.id, quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="text-center sm:text-right">
                      <p className="text-base sm:text-lg font-semibold text-secondary-900">
                        {formatCurrency(subtotal)}
                      </p>
                      <p className="text-xs sm:text-sm text-secondary-600">
                        Subtotal
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {selectedMaterials.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-secondary-400" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Nenhum material selecionado
          </h3>
          <p className="text-secondary-500">
            Volte ao passo anterior para selecionar os materiais.
          </p>
        </div>
      )}

      {/* Botões */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 space-y-3 sm:space-y-0">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Voltar
        </Button>
        
        <Button
          onClick={onNext}
          disabled={selectedMaterials.length === 0}
          className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
        >
          Continuar
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
        </Button>
      </div>

      {/* Modals */}
      <SuppliersModal
        isOpen={showSuppliersModal}
        onClose={() => setShowSuppliersModal(false)}
        material={selectedMaterial}
        userPlan={currentUser?.plano}
        onAddToBudget={handleAddToBudget}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={currentUser?.plano}
      />
    </motion.div>
  );
};

export default Step4Materials;