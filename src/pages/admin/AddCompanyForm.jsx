import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, MapPin, User, Package, Plus, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import { useCompany } from '../../contexts/CompanyContext';
import toast from 'react-hot-toast';

const AddCompanyForm = ({ onSuccess, onCancel }) => {
  const { addCompany } = useCompany();
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: {
      rua: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    responsavel: '',
    categoria: '',
    produtos: []
  });
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    { value: 'Construtora', label: 'Construtora' },
    { value: 'Distribuidora', label: 'Distribuidora' },
    { value: 'Fornecedor', label: 'Fornecedor' },
    { value: 'Prestador de Serviços', label: 'Prestador de Serviços' },
    { value: 'Outro', label: 'Outro' }
  ];

  const productCategoryOptions = [
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

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addProduct = () => {
    const newProduct = {
      nome: '',
      descricao: '',
      categoria: '',
      unidade: '',
      preco: '',
      estoque: '',
      fornecedor: ''
    };
    setFormData(prev => ({
      ...prev,
      produtos: [...prev.produtos, newProduct]
    }));
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      produtos: prev.produtos.filter((_, i) => i !== index)
    }));
  };

  const updateProduct = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      produtos: prev.produtos.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        throw new Error('Nome da empresa é obrigatório');
      }
      if (!formData.cnpj.trim()) {
        throw new Error('CNPJ é obrigatório');
      }
      if (!formData.email.trim()) {
        throw new Error('Email é obrigatório');
      }
      if (!formData.responsavel.trim()) {
        throw new Error('Responsável é obrigatório');
      }
      if (!formData.categoria.trim()) {
        throw new Error('Categoria é obrigatória');
      }

      // Validar produtos
      const validProducts = formData.produtos.filter(product => 
        product.nome.trim() && product.categoria.trim() && product.unidade.trim()
      );

      const companyData = {
        ...formData,
        produtos: validProducts.map(product => ({
          ...product,
          preco: parseFloat(product.preco) || 0,
          estoque: parseInt(product.estoque) || 0
        }))
      };

      const result = await addCompany(companyData);
      
      if (result.success) {
        toast.success('Empresa criada com sucesso!');
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
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Company Information */}
      <Card className="p-3">
        <h3 className="text-base font-semibold text-secondary-900 mb-2">
          Informações da Empresa
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-3">
            <Input
              label="Nome da Empresa"
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Digite o nome da empresa"
              icon={<Building2 className="h-4 w-4" />}
              required
            />
          </div>

          <div>
            <Input
              label="CNPJ"
              type="text"
              value={formData.cnpj}
              onChange={(e) => handleInputChange('cnpj', e.target.value)}
              placeholder="00.000.000/0000-00"
              icon={<Building2 className="h-4 w-4" />}
              required
            />
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contato@empresa.com"
              icon={<Mail className="h-4 w-4" />}
              required
            />
          </div>

          <div>
            <Input
              label="Telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              placeholder="(11) 99999-9999"
              icon={<Phone className="h-4 w-4" />}
            />
          </div>

          <div>
            <Input
              label="Responsável"
              type="text"
              value={formData.responsavel}
              onChange={(e) => handleInputChange('responsavel', e.target.value)}
              placeholder="Nome do responsável"
              icon={<User className="h-4 w-4" />}
              required
            />
          </div>

          <div>
            <Select
              label="Categoria"
              value={formData.categoria}
              onChange={(value) => handleInputChange('categoria', value)}
              options={categoryOptions}
              placeholder="Selecione a categoria"
              icon={<Building2 className="h-4 w-4" />}
              required
            />
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-3">
        <h3 className="text-base font-semibold text-secondary-900 mb-2">
          Endereço
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-4">
            <Input
              label="Rua"
              type="text"
              value={formData.endereco.rua}
              onChange={(e) => handleInputChange('endereco.rua', e.target.value)}
              placeholder="Rua, número, complemento"
              icon={<MapPin className="h-4 w-4" />}
            />
          </div>

          <div>
            <Input
              label="Cidade"
              type="text"
              value={formData.endereco.cidade}
              onChange={(e) => handleInputChange('endereco.cidade', e.target.value)}
              placeholder="Cidade"
              icon={<MapPin className="h-4 w-4" />}
            />
          </div>

          <div>
            <Input
              label="Estado"
              type="text"
              value={formData.endereco.estado}
              onChange={(e) => handleInputChange('endereco.estado', e.target.value)}
              placeholder="Estado (UF)"
              icon={<MapPin className="h-4 w-4" />}
            />
          </div>

          <div>
            <Input
              label="CEP"
              type="text"
              value={formData.endereco.cep}
              onChange={(e) => handleInputChange('endereco.cep', e.target.value)}
              placeholder="00000-000"
              icon={<MapPin className="h-4 w-4" />}
            />
          </div>
        </div>
      </Card>

      {/* Products */}
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-secondary-900">
            Produtos/Serviços
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addProduct}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>

        {formData.produtos.length === 0 ? (
          <div className="text-center py-4 text-secondary-500">
            <Package className="h-6 w-6 mx-auto mb-2 text-secondary-400" />
            <p className="text-sm">Nenhum produto adicionado ainda</p>
            <p className="text-xs">Clique em "Adicionar Produto" para começar</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {formData.produtos.map((product, index) => (
              <div key={index} className="border border-secondary-200 rounded-lg p-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-secondary-900 text-sm">
                    Produto {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProduct(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="md:col-span-3">
                    <Input
                      label="Nome do Produto"
                      type="text"
                      value={product.nome}
                      onChange={(e) => updateProduct(index, 'nome', e.target.value)}
                      placeholder="Nome do produto"
                    />
                  </div>

                  <div>
                    <Select
                      label="Categoria"
                      value={product.categoria}
                      onChange={(e) => updateProduct(index, 'categoria', e.target.value)}
                      options={productCategoryOptions}
                      placeholder="Selecione a categoria"
                    />
                  </div>

                  <div>
                    <Select
                      label="Unidade"
                      value={product.unidade}
                      onChange={(e) => updateProduct(index, 'unidade', e.target.value)}
                      options={unitOptions}
                      placeholder="Selecione a unidade"
                    />
                  </div>

                  <div>
                    <Input
                      label="Preço"
                      type="number"
                      step="0.01"
                      value={product.preco}
                      onChange={(e) => updateProduct(index, 'preco', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Input
                      label="Estoque"
                      type="number"
                      value={product.estoque}
                      onChange={(e) => updateProduct(index, 'estoque', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Input
                      label="Fornecedor"
                      type="text"
                      value={product.fornecedor}
                      onChange={(e) => updateProduct(index, 'fornecedor', e.target.value)}
                      placeholder="Nome do fornecedor"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Input
                      label="Descrição"
                      type="text"
                      value={product.descricao}
                      onChange={(e) => updateProduct(index, 'descricao', e.target.value)}
                      placeholder="Descrição do produto"
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-3 border-t border-secondary-200">
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
          Criar Empresa
        </Button>
      </div>
    </motion.form>
  );
};

export default AddCompanyForm;
