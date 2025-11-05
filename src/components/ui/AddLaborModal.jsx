import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Users } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const AddLaborModal = ({ isOpen, onClose, onAddLabor }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: 'dia',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'Construção',
    'Elétrica',
    'Hidráulica',
    'Acabamento',
    'Madeira',
    'Metal',
    'Auxiliar',
    'Supervisão',
    'Outros'
  ];

  const units = [
    { value: 'dia', label: 'dia' },
    { value: 'hora', label: 'hora' },
    { value: 'semana', label: 'semana' },
    { value: 'mês', label: 'mês' },
    { value: 'serviço', label: 'serviço' }
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
      newErrors.name = 'Nome do profissional é obrigatório';
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
      const newLabor = {
        id: `custom-labor-${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        unit: formData.unit,
        description: formData.description.trim(),
        isCustom: true
      };
      
      onAddLabor(newLabor);
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        price: '',
        unit: 'dia',
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
      unit: 'dia',
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
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">
                  Adicionar Mão de Obra
                </h2>
                <p className="text-xs sm:text-sm text-secondary-600">
                  Cadastre um novo profissional
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-secondary-400 hover:text-secondary-600 h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <Input
              label="Nome do Profissional"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Pedreiro Especializado"
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

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
              placeholder="Descrição das atividades do profissional"
              multiline
              rows={3}
            />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3 flex items-center justify-center space-x-2"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Adicionar Profissional</span>
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddLaborModal;

