import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase, ArrowLeft, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { PLANOS } from '../../data/constants';

const RegisterPage = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefone: '',
    profissao: '',
    plano: 'basico'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const result = await register({
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        telefone: formData.telefone.trim(),
        profissao: formData.profissao.trim(),
        plano: formData.plano
      });
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 text-center">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <Check className="h-8 w-8 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                Conta criada com sucesso!
              </h2>
              <p className="text-secondary-600 mb-6">
                Redirecionando para o login...
              </p>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <motion.div
                  className="bg-green-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4"
            >
              <span className="text-2xl font-bold text-white">G</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-secondary-900">
              Crie sua conta
            </CardTitle>
            <CardDescription className="text-secondary-600">
              Comece a usar o Geco gratuitamente
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  icon={<User className="h-4 w-4" />}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  icon={<Mail className="h-4 w-4" />}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    icon={<Lock className="h-4 w-4" />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirmar Senha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme sua senha"
                    icon={<Lock className="h-4 w-4" />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  icon={<Phone className="h-4 w-4" />}
                />

                <Input
                  label="Profissão"
                  name="profissao"
                  value={formData.profissao}
                  onChange={handleChange}
                  placeholder="Ex: Arquiteto, Engenheiro"
                  icon={<Briefcase className="h-4 w-4" />}
                />
              </div>

              <div>
                <label className="label text-secondary-700 mb-3 block">
                  Escolha seu Plano
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {PLANOS.map((plano) => (
                    <label
                      key={plano.id}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-300 ${
                        formData.plano === plano.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="plano"
                        value={plano.id}
                        checked={formData.plano === plano.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <h4 className="font-bold text-lg capitalize mb-1">
                          {plano.name}
                        </h4>
                        <p className="text-sm text-secondary-600 mb-2">
                          {plano.description}
                        </p>
                        <p className="text-xl font-bold text-primary-600 mb-3">
                          {plano.price}
                        </p>
                        <ul className="text-xs text-secondary-500 space-y-1">
                          {plano.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
                disabled={!formData.nome || !formData.email || !formData.password || !formData.confirmPassword}
              >
                Criar Conta
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-secondary-600">
                Já tem uma conta?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Faça login aqui
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

