import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, MapPin, User, Package, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { useCompany } from '../../contexts/CompanyContext';
import toast from 'react-hot-toast';

const CompanyProfileModal = ({ company, onClose }) => {
  const { addProduct, updateProduct, deleteProduct } = useCompany();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'inativo':
        return 'bg-red-100 text-red-800';
      case 'suspenso':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryBadgeColor = (categoria) => {
    switch (categoria) {
      case 'Construtora':
        return 'bg-blue-100 text-blue-800';
      case 'Distribuidora':
        return 'bg-purple-100 text-purple-800';
      case 'Fornecedor':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      const result = await deleteProduct(company.id, productId);
      if (result.success) {
        toast.success('Produto excluído com sucesso!');
      } else {
        toast.error('Erro ao excluir produto');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-4 pb-6 border-b border-secondary-200">
        <div className="flex-shrink-0">
          <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-secondary-900">{company.nome}</h2>
          <p className="text-secondary-600">{company.email}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeColor(company.categoria)}`}>
              {company.categoria}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(company.status)}`}>
              {company.status}
            </span>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Informações da Empresa
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Nome</p>
                <p className="text-sm text-secondary-600">{company.nome}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">CNPJ</p>
                <p className="text-sm text-secondary-600">{company.cnpj}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Email</p>
                <p className="text-sm text-secondary-600">{company.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Telefone</p>
                <p className="text-sm text-secondary-600">
                  {company.telefone || 'Não informado'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Responsável</p>
                <p className="text-sm text-secondary-600">{company.responsavel}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Endereço
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Endereço</p>
                <p className="text-sm text-secondary-600">
                  {company.endereco?.rua || 'Não informado'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Cidade/Estado</p>
                <p className="text-sm text-secondary-600">
                  {company.endereco?.cidade && company.endereco?.estado 
                    ? `${company.endereco.cidade}, ${company.endereco.estado}`
                    : 'Não informado'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">CEP</p>
                <p className="text-sm text-secondary-600">
                  {company.endereco?.cep || 'Não informado'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Informações da Conta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-secondary-400" />
            <div>
              <p className="text-sm font-medium text-secondary-900">Cadastrado em</p>
              <p className="text-sm text-secondary-600">
                {formatDate(company.createdAt)}
              </p>
            </div>
          </div>
          
          {company.updatedAt && company.updatedAt !== company.createdAt && (
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Última atualização</p>
                <p className="text-sm text-secondary-600">
                  {formatDate(company.updatedAt)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Products */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">
            Produtos/Serviços ({company.produtos?.length || 0})
          </h3>
          <Button
            variant="outline"
            onClick={() => setShowAddProductModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>

        {company.produtos && company.produtos.length > 0 ? (
          <div className="space-y-4">
            {company.produtos.map((product) => (
              <div key={product.id} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-secondary-900">{product.nome}</h4>
                    <p className="text-sm text-secondary-600">{product.descricao}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                      title="Editar produto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      title="Excluir produto"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-secondary-900">Categoria</p>
                    <p className="text-secondary-600">{product.categoria}</p>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">Unidade</p>
                    <p className="text-secondary-600">{product.unidade}</p>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">Preço</p>
                    <p className="text-secondary-600">{formatCurrency(product.preco)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">Estoque</p>
                    <p className="text-secondary-600">{product.estoque}</p>
                  </div>
                </div>
                
                {product.fornecedor && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-secondary-900">Fornecedor</p>
                    <p className="text-sm text-secondary-600">{product.fornecedor}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-secondary-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-secondary-400" />
            <p>Nenhum produto cadastrado</p>
            <p className="text-sm">Clique em "Adicionar Produto" para começar</p>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
        <Button
          variant="ghost"
          onClick={onClose}
        >
          Fechar
        </Button>
        <Button>
          Editar Empresa
        </Button>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        title="Adicionar Produto"
        size="lg"
      >
        <AddProductForm
          companyId={company.id}
          onSuccess={() => setShowAddProductModal(false)}
          onCancel={() => setShowAddProductModal(false)}
        />
      </Modal>
    </motion.div>
  );
};

// Componente para adicionar produto (simplificado)
const AddProductForm = ({ companyId, onSuccess, onCancel }) => {
  const { addProduct } = useCompany();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    unidade: '',
    preco: '',
    estoque: '',
    fornecedor: ''
  });
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    { value: 'Materiais Básicos', label: 'Materiais Básicos' },
    { value: 'Ferramentas', label: 'Ferramentas' },
    { value: 'Equipamentos', label: 'Equipamentos' },
    { value: 'Serviços', label: 'Serviços' },
    { value: 'Outro', label: 'Outro' }
  ];

  const unitOptions = [
    { value: 'unidade', label: 'Unidade' },
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'm', label: 'Metro (m)' },
    { value: 'm²', label: 'Metro Quadrado (m²)' },
    { value: 'm³', label: 'Metro Cúbico (m³)' },
    { value: 'saco', label: 'Saco' },
    { value: 'milheiro', label: 'Milheiro' },
    { value: 'tonelada', label: 'Tonelada' },
    { value: 'litro', label: 'Litro' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        preco: parseFloat(formData.preco) || 0,
        estoque: parseInt(formData.estoque) || 0
      };

      const result = await addProduct(companyId, productData);
      
      if (result.success) {
        toast.success('Produto adicionado com sucesso!');
        onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="md:col-span-3">
          <Input
            label="Nome do Produto"
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            placeholder="Nome do produto"
            required
          />
        </div>

        <div>
          <Select
            label="Categoria"
            value={formData.categoria}
            onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
            options={categoryOptions}
            placeholder="Selecione a categoria"
            required
          />
        </div>

        <div>
          <Select
            label="Unidade"
            value={formData.unidade}
            onChange={(e) => setFormData(prev => ({ ...prev, unidade: e.target.value }))}
            options={unitOptions}
            placeholder="Selecione a unidade"
            required
          />
        </div>

        <div>
          <Input
            label="Preço"
            type="number"
            step="0.01"
            value={formData.preco}
            onChange={(e) => setFormData(prev => ({ ...prev, preco: e.target.value }))}
            placeholder="0.00"
          />
        </div>

        <div>
          <Input
            label="Estoque"
            type="number"
            value={formData.estoque}
            onChange={(e) => setFormData(prev => ({ ...prev, estoque: e.target.value }))}
            placeholder="0"
          />
        </div>

        <div>
          <Input
            label="Fornecedor"
            type="text"
            value={formData.fornecedor}
            onChange={(e) => setFormData(prev => ({ ...prev, fornecedor: e.target.value }))}
            placeholder="Nome do fornecedor"
          />
        </div>

        <div className="md:col-span-3">
          <Input
            label="Descrição"
            type="text"
            value={formData.descricao}
            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
            placeholder="Descrição do produto"
          />
        </div>

      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          Adicionar Produto
        </Button>
      </div>
    </form>
  );
};

export default CompanyProfileModal;
