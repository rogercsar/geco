import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  DollarSign,
  Package,
  Truck,
  CheckCircle
} from 'lucide-react';
import Button from './Button';
import Card from './Card';
import Badge from './Badge';
import { formatCurrency } from '../../utils/format';

const SuppliersModal = ({ isOpen, onClose, material, userPlan, onAddToBudget }) => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [sortBy, setSortBy] = useState('price'); // price, rating, distance
  const [quantity, setQuantity] = useState(1);

  // Dados mockados de fornecedores
  const suppliers = [
    {
      id: 1,
      name: 'Materiais São Paulo',
      rating: 4.8,
      distance: '2.5 km',
      price: material?.price || 25.50,
      deliveryTime: '1-2 dias',
      phone: '(11) 99999-9999',
      email: 'contato@materiaissaopaulo.com.br',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      specialties: ['Cimento', 'Areia', 'Brita'],
      delivery: true,
      pickup: true,
      paymentMethods: ['Dinheiro', 'Cartão', 'PIX'],
      description: 'Especializada em materiais de construção há mais de 20 anos.',
      image: '/api/placeholder/100/100'
    },
    {
      id: 2,
      name: 'Construção Total',
      rating: 4.6,
      distance: '5.2 km',
      price: (material?.price || 25.50) * 0.95,
      deliveryTime: '2-3 dias',
      phone: '(11) 88888-8888',
      email: 'vendas@construcaototal.com.br',
      address: 'Av. Industrial, 456 - São Paulo, SP',
      specialties: ['Tijolos', 'Ferro', 'Madeira'],
      delivery: true,
      pickup: true,
      paymentMethods: ['Cartão', 'PIX', 'Boleto'],
      description: 'Fornecedor completo com os melhores preços da região.',
      image: '/api/placeholder/100/100'
    },
    {
      id: 3,
      name: 'Materiais Premium',
      rating: 4.9,
      distance: '8.1 km',
      price: (material?.price || 25.50) * 1.1,
      deliveryTime: '1 dia',
      phone: '(11) 77777-7777',
      email: 'premium@materiais.com.br',
      address: 'Rua Premium, 789 - São Paulo, SP',
      specialties: ['Materiais Premium', 'Importados'],
      delivery: true,
      pickup: false,
      paymentMethods: ['Cartão', 'PIX'],
      description: 'Materiais de alta qualidade com entrega rápida.',
      image: '/api/placeholder/100/100'
    },
    {
      id: 4,
      name: 'Depósito Central',
      rating: 4.4,
      distance: '12.3 km',
      price: (material?.price || 25.50) * 0.9,
      deliveryTime: '3-5 dias',
      phone: '(11) 66666-6666',
      email: 'central@deposito.com.br',
      address: 'Rodovia SP-348, Km 15 - São Paulo, SP',
      specialties: ['Atacado', 'Grandes Quantidades'],
      delivery: true,
      pickup: true,
      paymentMethods: ['Dinheiro', 'Cartão', 'PIX', 'Boleto'],
      description: 'Atacado com os melhores preços para grandes volumes.',
      image: '/api/placeholder/100/100'
    }
  ];

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      default:
        return 0;
    }
  });

  const handleAddToBudget = () => {
    if (selectedSupplier && material) {
      const materialWithSupplier = {
        ...material,
        price: selectedSupplier.price,
        supplier: {
          id: selectedSupplier.id,
          name: selectedSupplier.name,
          phone: selectedSupplier.phone,
          email: selectedSupplier.email
        },
        quantity: quantity
      };
      
      onAddToBudget(materialWithSupplier);
      onClose();
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 text-yellow-400 fill-current opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden mx-2 sm:mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-secondary-200">
            <div className="flex items-start sm:items-center justify-between space-x-3">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg flex-shrink-0">
                  <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-primary-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-secondary-900 truncate">
                    Fornecedores de {material?.name || 'Material'}
                  </h2>
                  <p className="text-xs sm:text-sm text-secondary-600">
                    Compare preços e escolha o melhor fornecedor
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-3 sm:p-4 border-b border-secondary-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={sortBy === 'price' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('price')}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                >
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Menor Preço</span>
                  <span className="sm:hidden">Preço</span>
                </Button>
                <Button
                  variant={sortBy === 'rating' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('rating')}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                >
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Melhor Avaliação</span>
                  <span className="sm:hidden">Avaliação</span>
                </Button>
                <Button
                  variant={sortBy === 'distance' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('distance')}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                >
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Mais Próximo</span>
                  <span className="sm:hidden">Distância</span>
                </Button>
              </div>
              <Badge variant="primary" className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                {userPlan === 'pro' ? 'Pro' : 'Empresarial'}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row h-96">
            {/* Suppliers List */}
            <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-secondary-200 overflow-y-auto">
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {sortedSuppliers.map((supplier) => (
                  <motion.div
                    key={supplier.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedSupplier?.id === supplier.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-25'
                    }`}
                    onClick={() => setSelectedSupplier(supplier)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                          <h3 className="font-semibold text-secondary-900 text-sm sm:text-base truncate">
                            {supplier.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {renderStars(supplier.rating)}
                            <span className="text-xs sm:text-sm text-secondary-600">
                              ({supplier.rating})
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-secondary-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{supplier.distance}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Truck className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{supplier.deliveryTime}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          <span className="text-base sm:text-lg font-bold text-primary-600">
                            {formatCurrency(supplier.price)}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {supplier.delivery && (
                              <Badge variant="outline" size="sm" className="text-xs px-2 py-1">
                                Entrega
                              </Badge>
                            )}
                            {supplier.pickup && (
                              <Badge variant="outline" size="sm" className="text-xs px-2 py-1">
                                Retirada
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Supplier Details */}
            <div className="w-full lg:w-1/2 p-4 sm:p-6 overflow-y-auto">
              {selectedSupplier ? (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 mb-2">
                      {selectedSupplier.name}
                    </h3>
                    <div className="flex items-center space-x-1 mb-3 sm:mb-4">
                      {renderStars(selectedSupplier.rating)}
                      <span className="text-xs sm:text-sm text-secondary-600">
                        {selectedSupplier.rating} ({selectedSupplier.distance})
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-secondary-600">
                      {selectedSupplier.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-1 sm:mb-2 text-sm sm:text-base">Preço</h4>
                      <p className="text-lg sm:text-2xl font-bold text-primary-600">
                        {formatCurrency(selectedSupplier.price)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-1 sm:mb-2 text-sm sm:text-base">Entrega</h4>
                      <p className="text-xs sm:text-sm text-secondary-600">
                        {selectedSupplier.deliveryTime}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2 text-sm sm:text-base">Especialidades</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {selectedSupplier.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs px-2 py-1">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2 text-sm sm:text-base">Formas de Pagamento</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {selectedSupplier.paymentMethods.map((method) => (
                        <Badge key={method} variant="secondary" className="text-xs px-2 py-1">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-secondary-600 truncate">{selectedSupplier.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-secondary-600 truncate">{selectedSupplier.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-secondary-600 truncate">{selectedSupplier.address}</span>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2 text-sm sm:text-base">Quantidade</h4>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="h-8 w-8 p-0 text-sm"
                        >
                          -
                        </Button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 sm:w-20 text-center border border-secondary-300 rounded px-2 py-1 text-sm"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(quantity + 1)}
                          className="h-8 w-8 p-0 text-sm"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-primary-50 border border-primary-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-primary-900 text-sm sm:text-base">Total:</span>
                        <span className="text-lg sm:text-xl font-bold text-primary-600">
                          {formatCurrency(selectedSupplier.price * quantity)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-primary-700">
                        {quantity} x {formatCurrency(selectedSupplier.price)} = {formatCurrency(selectedSupplier.price * quantity)}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button 
                        className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                        onClick={handleAddToBudget}
                      >
                        <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Adicionar ao Orçamento</span>
                        <span className="sm:hidden">Adicionar</span>
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button variant="outline" className="flex-1 text-sm sm:text-base py-2 sm:py-3">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Ligar
                      </Button>
                      <Button variant="outline" className="flex-1 text-sm sm:text-base py-2 sm:py-3">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center">
                    <Building2 className="h-8 w-8 sm:h-12 sm:w-12 text-secondary-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-secondary-900 mb-2">
                      Selecione um fornecedor
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary-600">
                      Clique em um fornecedor para ver mais detalhes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuppliersModal;
