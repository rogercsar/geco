import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Briefcase, Shield, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AddUserForm = ({ onSuccess, onCancel }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    telefone: '',
    profissao: '',
    plano: 'basico',
    isAdmin: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const planOptions = [
    { value: 'basico', label: 'Básico' },
    { value: 'pro', label: 'Pro' },
    { value: 'empresarial', label: 'Empresarial' }
  ];

  const professionOptions = [
    { value: 'Arquiteto', label: 'Arquiteto' },
    { value: 'Engenheiro Civil', label: 'Engenheiro Civil' },
    { value: 'Construtor', label: 'Construtor' },
    { value: 'Projetista', label: 'Projetista' },
    { value: 'Consultor', label: 'Consultor' },
    { value: 'Outro', label: 'Outro' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        throw new Error('Nome é obrigatório');
      }
      if (!formData.email.trim()) {
        throw new Error('Email é obrigatório');
      }
      if (!formData.password.trim()) {
        throw new Error('Senha é obrigatória');
      }
      if (formData.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }
      if (!formData.profissao.trim()) {
        throw new Error('Profissão é obrigatória');
      }

      const result = await register(formData);
      
      if (result.success) {
        toast.success('Usuário criado com sucesso!');
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
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="md:col-span-2">
          <Input
            label="Nome Completo"
            type="text"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            placeholder="Digite o nome completo"
            icon={<User className="h-4 w-4" />}
            required
          />
        </div>

        {/* Email */}
        <div>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Digite o email"
            icon={<Mail className="h-4 w-4" />}
            required
          />
        </div>

        {/* Telefone */}
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

        {/* Profissão */}
        <div>
          <Select
            label="Profissão"
            value={formData.profissao}
            onChange={(value) => handleInputChange('profissao', value)}
            options={professionOptions}
            placeholder="Selecione a profissão"
            icon={<Briefcase className="h-4 w-4" />}
            required
          />
        </div>

        {/* Plano */}
        <div>
          <Select
            label="Plano"
            value={formData.plano}
            onChange={(value) => handleInputChange('plano', value)}
            options={planOptions}
            placeholder="Selecione o plano"
            icon={<Shield className="h-4 w-4" />}
            required
          />
        </div>

        {/* Senha */}
        <div className="md:col-span-2">
          <div className="relative">
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Digite a senha"
              icon={<Shield className="h-4 w-4" />}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-secondary-500 mt-1">
            Mínimo de 6 caracteres
          </p>
        </div>
      </div>

      {/* Admin Checkbox */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="isAdmin"
          checked={formData.isAdmin}
          onChange={(e) => handleInputChange('isAdmin', e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
        />
        <label htmlFor="isAdmin" className="text-sm font-medium text-secondary-700">
          Conceder privilégios de administrador
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
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
          Criar Usuário
        </Button>
      </div>
    </motion.form>
  );
};

export default AddUserForm;
