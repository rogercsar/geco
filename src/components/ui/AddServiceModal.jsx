import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Package } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const AddServiceModal = ({ isOpen, onClose, onAddService, budgetMode, selectedOption }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: 'm²',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'Estrutural',
    'Acabamento',
    'Instalações',
    'Elétrica',
    'Hidráulica',
    'Pintura',
    'Revestimento',
    'Piso',
    'Cobertura',
    'Outros'
  ];

  const units = [
    { value: 'm²', label: 'm² (metro quadrado)' },
    { value: 'm³', label: 'm³ (metro cúbico)' },
    { value: 'm', label: 'm (metro linear)' },
    { value: 'unidade', label: 'unidade' },
    { value: 'hora', label: 'hora' },
    { value: 'dia', label: 'dia' },
    { value: 'kg', label: 'kg (quilograma)' },
    { value: 'l', label: 'l (litro)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do serviço é obrigatório';
    }
    
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser um valor válido maior que zero';
    }
    
    if (!formData.unit) {
      newErrors.unit = 'Unidade é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newService = {
        id: `custom-${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        unit: formData.unit,
        description: formData.description.trim(),
        isCustom: true
      };
      
      onAddService(newService);
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        price: '',
        unit: 'm²',
        description: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      unit: 'm²',
      description: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Adicionar Serviço
                </h2>
                <p className="text-sm text-secondary-600">
                  {budgetMode === 'casa' ? 'Casa Completa' : 
                   budgetMode === 'etapas' ? `Etapa: ${selectedOption}` : 
                   `Cômodo: ${selectedOption}`}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome do Serviço"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Instalação de Ar Condicionado"
              error={errors.name}
              required
            />

            <Select
              label="Categoria"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Selecione a categoria"
              error={errors.category}
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Preço"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                error={errors.price}
                required
              />

              <Select
                label="Unidade"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                error={errors.unit}
                required
              >
                {units.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </Select>
            </div>

            <Input
              label="Descrição (opcional)"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descrição detalhada do serviço"
              multiline
              rows={3}
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Serviço</span>
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddServiceModal;

