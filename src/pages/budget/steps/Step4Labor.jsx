import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Clock, DollarSign, Star, Heart } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import AddLaborModal from '../../../components/ui/AddLaborModal';
import { formatCurrency } from '../../../utils/format';

const Step4Labor = ({ data, onUpdate, onNext, onBack, loading }) => {
  const { labor, quantidades } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [showAddLaborModal, setShowAddLaborModal] = useState(false);
  const [customLabor, setCustomLabor] = useState({});

  // Base de dados de mão de obra
  const laborData = {
    'pedreiro': { 
      id: 'pedreiro', 
      name: 'Pedreiro', 
      category: 'Construção', 
      price: 120.00, 
      unit: 'dia',
      description: 'Serviços de alvenaria e construção'
    },
    'eletricista': { 
      id: 'eletricista', 
      name: 'Eletricista', 
      category: 'Elétrica', 
      price: 150.00, 
      unit: 'dia',
      description: 'Instalações elétricas e manutenção'
    },
    'encanador': { 
      id: 'encanador', 
      name: 'Encanador', 
      category: 'Hidráulica', 
      price: 130.00, 
      unit: 'dia',
      description: 'Instalações hidráulicas e sanitárias'
    },
    'pintor': { 
      id: 'pintor', 
      name: 'Pintor', 
      category: 'Acabamento', 
      price: 100.00, 
      unit: 'dia',
      description: 'Pintura interna e externa'
    },
    'carpinteiro': { 
      id: 'carpinteiro', 
      name: 'Carpinteiro', 
      category: 'Madeira', 
      price: 140.00, 
      unit: 'dia',
      description: 'Trabalhos em madeira e marcenaria'
    },
    'azulejista': { 
      id: 'azulejista', 
      name: 'Azulejista', 
      category: 'Acabamento', 
      price: 110.00, 
      unit: 'dia',
      description: 'Instalação de azulejos e revestimentos'
    },
    'gesseiro': { 
      id: 'gesseiro', 
      name: 'Gesseiro', 
      category: 'Acabamento', 
      price: 90.00, 
      unit: 'dia',
      description: 'Instalação de gesso e drywall'
    },
    'soldador': { 
      id: 'soldador', 
      name: 'Soldador', 
      category: 'Metal', 
      price: 160.00, 
      unit: 'dia',
      description: 'Soldas e trabalhos em metal'
    },
    'ajudante': { 
      id: 'ajudante', 
      name: 'Ajudante Geral', 
      category: 'Auxiliar', 
      price: 80.00, 
      unit: 'dia',
      description: 'Auxiliar em diversas atividades'
    },
    'engenheiro': { 
      id: 'engenheiro', 
      name: 'Engenheiro Civil', 
      category: 'Supervisão', 
      price: 300.00, 
      unit: 'dia',
      description: 'Supervisão e coordenação técnica'
    }
  };

  const filteredLabor = useMemo(() => {
    const allLabor = { ...laborData, ...customLabor };
    return Object.values(allLabor).filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, customLabor]);

  const selectedLabor = useMemo(() => {
    const selectedIds = labor || [];
    const allLabor = { ...laborData, ...customLabor };
    return selectedIds.map(id => allLabor[id]).filter(Boolean);
  }, [labor, customLabor]);

  const totalValue = useMemo(() => {
    return selectedLabor.reduce((total, item) => {
      const quantity = quantidades?.[item.id] || 0;
      return total + (item.price * quantity);
    }, 0);
  }, [selectedLabor, quantidades]);

  const handleAddLabor = (laborId) => {
    const currentLabor = labor || [];
    if (!currentLabor.includes(laborId)) {
      onUpdate({
        labor: [...currentLabor, laborId],
        quantidades: {
          ...quantidades,
          [laborId]: 1
        }
      });
    }
  };

  const handleRemoveLabor = (laborId) => {
    const currentLabor = labor || [];
    const newLabor = currentLabor.filter(id => id !== laborId);
    const newQuantidades = { ...quantidades };
    delete newQuantidades[laborId];
    
    onUpdate({
      labor: newLabor,
      quantidades: newQuantidades
    });
  };

  const handleQuantityChange = (laborId, quantity) => {
    const newQuantidades = {
      ...quantidades,
      [laborId]: Math.max(0, parseInt(quantity) || 0)
    };
    
    onUpdate({ quantidades: newQuantidades });
  };

  const handleToggleFavorite = (laborId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(laborId)) {
      newFavorites.delete(laborId);
    } else {
      newFavorites.add(laborId);
    }
    setFavorites(newFavorites);
  };

  const handleAddCustomLabor = (newLabor) => {
    setCustomLabor(prev => ({
      ...prev,
      [newLabor.id]: newLabor
    }));
  };

  const categories = [...new Set(Object.values(laborData).map(item => item.category))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          Mão de Obra
        </h2>
        <p className="text-secondary-600">
          Selecione os profissionais necessários para seu projeto
        </p>
      </div>

      {/* Busca */}
      <div className="max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Buscar mão de obra..."
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

      {/* Botão Adicionar Mão de Obra */}
      <div className="flex justify-center mb-6">
        <Button
          variant="outline"
          onClick={() => setShowAddLaborModal(true)}
          className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 border-2 border-dashed border-primary-300 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-sm sm:text-base"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Adicionar Nova Mão de Obra</span>
        </Button>
      </div>

      {/* Lista de mão de obra disponível */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredLabor.map((item) => {
          const isSelected = labor?.includes(item.id) || false;
          const isFavorite = favorites.has(item.id);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Card className={`p-3 sm:p-4 transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-primary-500 bg-primary-50' 
                  : 'hover:shadow-md'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-secondary-900 text-sm sm:text-base truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-secondary-600 truncate">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleFavorite(item.id)}
                      className={`p-1 rounded-full transition-colors ${
                        isFavorite 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-secondary-600 mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                    <span className="font-semibold text-secondary-900 text-sm sm:text-base">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="text-xs sm:text-sm text-secondary-600">
                      / {item.unit}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <label className="text-xs sm:text-sm font-medium text-secondary-700">
                        Quantidade:
                      </label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="0"
                          value={quantidades?.[item.id] || 0}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-16 sm:w-20 text-center text-sm"
                        />
                        <span className="text-xs sm:text-sm text-secondary-600">
                          {item.unit}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-secondary-700">
                        Subtotal:
                      </span>
                      <span className="font-semibold text-primary-600 text-sm sm:text-base">
                        {formatCurrency((quantidades?.[item.id] || 0) * item.price)}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveLabor(item.id)}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs sm:text-sm py-2"
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleAddLabor(item.id)}
                    className="w-full text-xs sm:text-sm py-2"
                    disabled={loading}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Adicionar
                  </Button>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Resumo da seleção */}
      {selectedLabor.length > 0 && (
        <Card className="p-4 sm:p-6 bg-primary-50 border-primary-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-primary-900">
                Mão de Obra Selecionada
              </h3>
              <p className="text-xs sm:text-sm text-primary-700">
                {selectedLabor.length} profissional(is) selecionado(s)
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xl sm:text-2xl font-bold text-primary-900">
                {formatCurrency(totalValue)}
              </p>
              <p className="text-xs sm:text-sm text-primary-700">
                Valor total
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Ações */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 space-y-3 sm:space-y-0">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
        >
          Voltar
        </Button>
        
        <Button
          onClick={onNext}
          disabled={loading || selectedLabor.length === 0}
          className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
        >
          Continuar
        </Button>
      </div>

      {/* Modal Adicionar Mão de Obra */}
      <AddLaborModal
        isOpen={showAddLaborModal}
        onClose={() => setShowAddLaborModal(false)}
        onAddLabor={handleAddCustomLabor}
      />
    </motion.div>
  );
};

export default Step4Labor;


