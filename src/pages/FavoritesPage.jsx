import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  Package, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Trash2,
  Search,
  Filter,
  SortAsc,
  Download,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBudget } from '../contexts/BudgetContext';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { formatCurrency } from '../utils/format';
import { canCreateNewBudget, getBudgetLimit } from '../utils/planGuard';
import UpgradeModal from '../components/ui/UpgradeModal';
import { showUpgradeToast } from '../utils/upgradeToast';

const FavoritesPage = ({ onPageChange }) => {
  const { currentUser } = useAuth();
  const { getBudgetsByUser } = useBudget();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, price, category, date
  const [filterBy, setFilterBy] = useState('all'); // all, materials, suppliers
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Dados mockados de favoritos
  const mockFavorites = [
    {
      id: 1,
      type: 'material',
      name: 'Cimento CP-II Z-32',
      category: 'Básico',
      price: 25.50,
      unit: 'saco',
      description: 'Cimento Portland composto com pozolana',
      image: '/api/placeholder/100/100',
      addedDate: '2024-01-15',
      supplier: {
        name: 'Materiais São Paulo',
        rating: 4.8,
        distance: '2.5 km'
      }
    },
    {
      id: 2,
      type: 'material',
      name: 'Areia Média',
      category: 'Básico',
      price: 85.00,
      unit: 'm³',
      description: 'Areia lavada para construção',
      image: '/api/placeholder/100/100',
      addedDate: '2024-01-14',
      supplier: {
        name: 'Construção Total',
        rating: 4.6,
        distance: '5.2 km'
      }
    },
    {
      id: 3,
      type: 'supplier',
      name: 'Materiais Premium',
      category: 'Fornecedor',
      rating: 4.9,
      distance: '8.1 km',
      specialties: ['Materiais Premium', 'Importados'],
      phone: '(11) 77777-7777',
      email: 'premium@materiais.com.br',
      address: 'Rua Premium, 789 - São Paulo, SP',
      addedDate: '2024-01-13'
    },
    {
      id: 4,
      type: 'material',
      name: 'Tijolo Cerâmico 9x19x19',
      category: 'Básico',
      price: 450.00,
      unit: 'milheiro',
      description: 'Tijolo cerâmico para alvenaria',
      image: '/api/placeholder/100/100',
      addedDate: '2024-01-12',
      supplier: {
        name: 'Depósito Central',
        rating: 4.4,
        distance: '12.3 km'
      }
    }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setFavorites(mockFavorites);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredFavorites = favorites.filter(favorite => {
    const matchesSearch = favorite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         favorite.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || favorite.type === filterBy;
    return matchesSearch && matchesFilter;
  });

  const handleCreateNewBudget = () => {
    const userBudgetsCount = currentUser ? getBudgetsByUser(currentUser.id).length : 0;
    if (canCreateNewBudget(currentUser, userBudgetsCount)) {
      onPageChange('new-budget');
    } else {
      const limit = getBudgetLimit(currentUser);
      showUpgradeToast(limit, () => setShowUpgradeModal(true));
    }
  };
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return (a.price || 0) - (b.price || 0);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'date':
        return new Date(b.addedDate) - new Date(a.addedDate);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Meus Favoritos
          </h1>
          <p className="text-secondary-600 mt-1">
            Materiais e fornecedores que você salvou
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-600">Total de Favoritos</p>
              <p className="text-2xl font-bold text-secondary-900">{favorites.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-600">Materiais</p>
              <p className="text-2xl font-bold text-secondary-900">
                {favorites.filter(f => f.type === 'material').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-600">Fornecedores</p>
              <p className="text-2xl font-bold text-secondary-900">
                {favorites.filter(f => f.type === 'supplier').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <Input
                type="text"
                placeholder="Buscar favoritos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="material">Materiais</option>
                <option value="supplier">Fornecedores</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="name">Nome</option>
                <option value="price">Preço</option>
                <option value="category">Categoria</option>
                <option value="date">Data</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Favorites List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedFavorites.map((favorite, index) => (
          <motion.div
            key={favorite.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    {favorite.type === 'material' ? (
                      <Package className="h-5 w-5 text-primary-600" />
                    ) : (
                      <Building2 className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {favorite.name}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {favorite.category}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {favorite.type === 'material' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Preço:</span>
                    <span className="font-semibold text-secondary-900">
                      {formatCurrency(favorite.price)} / {favorite.unit}
                    </span>
                  </div>
                  
                  {favorite.supplier && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Fornecedor:</span>
                      <span className="text-sm text-secondary-900">
                        {favorite.supplier.name}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Adicionado em:</span>
                    <span className="text-sm text-secondary-900">
                      {new Date(favorite.addedDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Package className="h-4 w-4 mr-2" />
                      Usar em Orçamento
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Avaliação:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-secondary-900">
                        {favorite.rating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Distância:</span>
                    <span className="text-sm text-secondary-900">
                      {favorite.distance}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Especialidades:</span>
                    <div className="flex flex-wrap gap-1">
                      {favorite.specialties?.slice(0, 2).map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" size="sm">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Building2 className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {sortedFavorites.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto mb-4 text-secondary-400" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Nenhum favorito encontrado
          </h3>
          <p className="text-secondary-500 mb-6">
            {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando materiais e fornecedores aos seus favoritos'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateNewBudget}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Novo Orçamento
            </Button>
          )}
        </div>
      )}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={currentUser?.plano}
      />
    </div>
  );
};

export default FavoritesPage;

