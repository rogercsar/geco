import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, Plus, Search, Calculator, Star, Heart, Building2, Crown } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import SuppliersModal from '../../../components/ui/SuppliersModal';
import UpgradeModal from '../../../components/ui/UpgradeModal';
import { canAccessSuppliers } from '../../../utils/planGuard';
import { showUpgradeToast } from '../../../utils/upgradeToast';
import { UPGRADE_MESSAGES } from '../../../data/constants';
import AddLaborModal from '../../../components/ui/AddLaborModal';
import { formatCurrency } from '../../../utils/format';
import { useAuth } from '../../../contexts/AuthContext';

const Step4Combined = ({ data, onUpdate, onNext, onBack, loading }) => {
  const { materials, labor, quantidades, suppliers } = data;
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('materials'); // 'materials' ou 'labor'
  const [favorites, setFavorites] = useState(new Set());
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAddLaborModal, setShowAddLaborModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [customLabor, setCustomLabor] = useState({});

  // Base de dados de materiais
  const materialsData = {
    'cimento': { id: 'cimento', name: 'Cimento', category: 'Básico', price: 25.50, unit: 'saco' },
    'areia': { id: 'areia', name: 'Areia', category: 'Básico', price: 85.00, unit: 'm³' },
    'brita': { id: 'brita', name: 'Brita', category: 'Básico', price: 95.00, unit: 'm³' },
    'tijolo': { id: 'tijolo', name: 'Tijolo', category: 'Básico', price: 450.00, unit: 'milheiro' },
    'ferro': { id: 'ferro', name: 'Ferro', category: 'Estrutural', price: 8.50, unit: 'kg' },
    'madeira': { id: 'madeira', name: 'Madeira', category: 'Estrutural', price: 1200.00, unit: 'm³' },
    'telha': { id: 'telha', name: 'Telha', category: 'Cobertura', price: 12.50, unit: 'unidade' },
    'piso': { id: 'piso', name: 'Piso', category: 'Acabamento', price: 45.00, unit: 'm²' },
    'tinta': { id: 'tinta', name: 'Tinta', category: 'Acabamento', price: 85.00, unit: 'galão' },
    'azulejo': { id: 'azulejo', name: 'Azulejo', category: 'Acabamento', price: 35.00, unit: 'm²' }
  };

  // Base de dados de mão de obra
  const laborData = {
    'pedreiro': { id: 'pedreiro', name: 'Pedreiro', category: 'Construção', price: 120.00, unit: 'dia' },
    'eletricista': { id: 'eletricista', name: 'Eletricista', category: 'Elétrica', price: 150.00, unit: 'dia' },
    'encanador': { id: 'encanador', name: 'Encanador', category: 'Hidráulica', price: 130.00, unit: 'dia' },
    'pintor': { id: 'pintor', name: 'Pintor', category: 'Acabamento', price: 100.00, unit: 'dia' },
    'carpinteiro': { id: 'carpinteiro', name: 'Carpinteiro', category: 'Madeira', price: 140.00, unit: 'dia' },
    'azulejista': { id: 'azulejista', name: 'Azulejista', category: 'Acabamento', price: 110.00, unit: 'dia' },
    'gesseiro': { id: 'gesseiro', name: 'Gesseiro', category: 'Acabamento', price: 90.00, unit: 'dia' },
    'soldador': { id: 'soldador', name: 'Soldador', category: 'Metal', price: 160.00, unit: 'dia' },
    'ajudante': { id: 'ajudante', name: 'Ajudante Geral', category: 'Auxiliar', price: 80.00, unit: 'dia' },
    'engenheiro': { id: 'engenheiro', name: 'Engenheiro Civil', category: 'Supervisão', price: 300.00, unit: 'dia' },
    ...customLabor
  };

  const currentData = activeTab === 'materials' ? materialsData : laborData;
  const currentSelection = activeTab === 'materials' ? materials : labor;

  const filteredItems = useMemo(() => {
    return Object.values(currentData).filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, currentData]);

  const selectedMaterials = useMemo(() => {
    const selectedIds = materials || [];
    return selectedIds.map(id => materialsData[id]).filter(Boolean);
  }, [materials]);

  const selectedLabor = useMemo(() => {
    const selectedIds = labor || [];
    return selectedIds.map(id => laborData[id]).filter(Boolean);
  }, [labor]);

  const materialsTotal = useMemo(() => {
    return selectedMaterials.reduce((total, item) => {
      const quantity = quantidades?.[item.id] || 0;
      return total + (item.price * quantity);
    }, 0);
  }, [selectedMaterials, quantidades]);

  const laborTotal = useMemo(() => {
    return selectedLabor.reduce((total, item) => {
      const quantity = quantidades?.[item.id] || 0;
      return total + (item.price * quantity);
    }, 0);
  }, [selectedLabor, quantidades]);

  const grandTotal = materialsTotal + laborTotal;

  const handleAddItem = (itemId) => {
    const currentItems = currentSelection || [];
    if (!currentItems.includes(itemId)) {
      const newItems = [...currentItems, itemId];
      onUpdate({
        [activeTab]: newItems,
        quantidades: {
          ...quantidades,
          [itemId]: 1
        }
      });
    }
  };

  const handleRemoveItem = (itemId) => {
    const currentItems = currentSelection || [];
    const newItems = currentItems.filter(id => id !== itemId);
    const newQuantidades = { ...quantidades };
    delete newQuantidades[itemId];
    
    onUpdate({
      [activeTab]: newItems,
      quantidades: newQuantidades
    });
  };

  const handleQuantityChange = (itemId, quantity) => {
    const newQuantidades = {
      ...quantidades,
      [itemId]: Math.max(0, parseInt(quantity) || 0)
    };
    
    onUpdate({ quantidades: newQuantidades });
  };

  const handleToggleFavorite = (itemId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
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
    
    onUpdate({ 
      ...data, 
      quantidades: newQuantidades,
      suppliers: {
        ...suppliers,
        [materialWithSupplier.id]: materialWithSupplier.supplier
      }
    });
  };

  const handleAddCustomLabor = (newLabor) => {
    // Adicionar o novo profissional à lista de mão de obra customizada
    setCustomLabor(prev => ({
      ...prev,
      [newLabor.id]: newLabor
    }));
    
    // Adicionar automaticamente ao orçamento
    const currentLabor = labor || [];
    if (!currentLabor.includes(newLabor.id)) {
      const newLaborList = [...currentLabor, newLabor.id];
      onUpdate({
        ...data,
        labor: newLaborList,
        quantidades: {
          ...quantidades,
          [newLabor.id]: 1
        }
      });
    }
  };

  const categories = [...new Set(Object.values(currentData).map(item => item.category))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          Materiais e Mão de Obra
        </h2>
        <p className="text-secondary-600">
          Selecione os materiais e profissionais necessários para seu projeto
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-secondary-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'materials'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Materiais
          </button>
          <button
            onClick={() => setActiveTab('labor')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'labor'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Mão de Obra
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="max-w-md mx-auto">
        <Input
          type="text"
          placeholder={`Buscar ${activeTab === 'materials' ? 'materiais' : 'mão de obra'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Filtros por categoria */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={searchTerm === '' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setSearchTerm('')}
        >
          Todas
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={searchTerm === category ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSearchTerm(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Botão Adicionar Serviço - apenas na aba de mão de obra */}
      {activeTab === 'labor' && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAddLaborModal(true)}
            className="border-dashed border-2 border-primary-300 text-primary-600 hover:bg-primary-50 hover:border-primary-400"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Serviço Personalizado
          </Button>
        </div>
      )}

      {/* Lista de itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isSelected = currentSelection?.includes(item.id) || false;
          const isFavorite = favorites.has(item.id);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Card className={`p-4 transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-primary-500 bg-primary-50' 
                  : 'hover:shadow-md'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activeTab === 'materials' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {activeTab === 'materials' ? (
                        <Package className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Users className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleFavorite(item.id)}
                      className={`p-1 rounded-full transition-colors ${
                        isFavorite 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    {activeTab === 'materials' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSuppliers(item)}
                        className="text-xs h-6 px-2 hover:bg-primary-50 hover:border-primary-300"
                      >
                        {canAccessSuppliers(currentUser) ? (
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
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-secondary-900">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="text-sm text-secondary-600">
                      / {item.unit}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <div className="space-y-3">
                    {/* Informações do fornecedor se disponível */}
                    {suppliers?.[item.id] && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-green-600" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-green-900">
                              Fornecedor: {suppliers[item.id].name}
                            </p>
                            <p className="text-xs text-green-700">
                              {suppliers[item.id].phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-secondary-700">
                        Quantidade:
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={quantidades?.[item.id] || 0}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-20"
                      />
                      <span className="text-sm text-secondary-600">
                        {item.unit}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-secondary-700">
                        Subtotal:
                      </span>
                      <span className="font-semibold text-primary-600">
                        {formatCurrency((quantidades?.[item.id] || 0) * item.price)}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleAddItem(item.id)}
                    className="w-full"
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Materiais</h3>
              <p className="text-sm text-blue-700">
                {selectedMaterials.length} item(ns)
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-900">
                {formatCurrency(materialsTotal)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900">Mão de Obra</h3>
              <p className="text-sm text-green-700">
                {selectedLabor.length} profissional(is)
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-900">
                {formatCurrency(laborTotal)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-purple-900">Total Geral</h3>
              <p className="text-sm text-purple-700">
                Investimento total
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-purple-900">
                {formatCurrency(grandTotal)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
        >
          Voltar
        </Button>
        
        <Button
          onClick={onNext}
          disabled={loading || grandTotal === 0}
        >
          Continuar
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
        feature="fornecedores"
      />

      <AddLaborModal
        isOpen={showAddLaborModal}
        onClose={() => setShowAddLaborModal(false)}
        onAddLabor={handleAddCustomLabor}
      />
    </motion.div>
  );
};

export default Step4Combined;


