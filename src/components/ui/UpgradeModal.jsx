import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Check, 
  Crown,
  Building2,
  Users,
  BarChart3,
  Zap,
  Shield,
  Award,
  ArrowRight
} from 'lucide-react';
import Button from './Button';
import Card from './Card';
import Badge from './Badge';
import { useSelector } from 'react-redux';
import api from '../../utils/api';

const UpgradeModal = ({ isOpen, onClose, currentPlan = 'básico' }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [selectedPeriod, setSelectedPeriod] = useState('mensal');
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth?.user);
  const plans = [
    {
      id: 'básico',
      name: 'Básico',
      price: 'Gratuito',
      period: '',
      description: 'Perfeito para começar',
      features: [
        'Até 5 orçamentos por mês',
        'Materiais básicos',
        'Suporte por email',
        'Exportação em PDF'
      ],
      limitations: [
        'Sem acesso a fornecedores',
        'Sem relatórios avançados',
        'Sem backup automático'
      ],
      popular: false,
      icon: Star,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 49,90',
      period: '/mês',
      description: 'Para profissionais',
      features: [
        'Orçamentos ilimitados',
        'Acesso a todos os materiais',
        'Lista de fornecedores',
        'Relatórios avançados',
        'Backup automático',
        'Suporte prioritário',
        'Templates personalizados',
        'Integração com APIs'
      ],
      limitations: [],
      popular: true,
      icon: Crown,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      id: 'empresarial',
      name: 'Empresarial',
      price: 'R$ 99,90',
      period: '/mês',
      description: 'Para empresas',
      features: [
        'Tudo do plano Pro',
        'Múltiplos usuários',
        'Gestão de equipe',
        'Relatórios customizados',
        'API completa',
        'Suporte 24/7',
        'Treinamento incluído',
        'SLA garantido'
      ],
      limitations: [],
      popular: false,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const currentPlanData = plans.find(plan => plan.id === currentPlan);
  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
  const calcPrice = (planId, period) => {
    const base = planId === 'pro' ? 49.9 : planId === 'empresarial' ? 99.9 : 0;
    const mult = period === 'mensal' ? 1 : period === 'semestral' ? 6 : 12;
    return (base * mult).toFixed(2);
  };

  const handleUpgrade = async () => {
    if (selectedPlan === 'básico') {
      onClose();
      return;
    }
    try {
      setLoading(true);
      const email = user?.email;
      const { data } = await api.post('/api/v1/payments/subscription', {
        plan: selectedPlan,
        period: selectedPeriod,
        email,
      });
      const initPoint = data?.init_point;
      if (initPoint) {
        window.location.href = initPoint;
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.error('Upgrade error', e);
    }
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
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-secondary-200 bg-gradient-to-r from-primary-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Zap className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900">
                    Upgrade seu Plano
                  </h2>
                  <p className="text-secondary-600">
                    Desbloqueie recursos exclusivos e aumente sua produtividade
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Current Plan Info */}
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  Plano Atual: {currentPlanData?.name}
                </h3>
                <p className="text-secondary-600">
                  {currentPlanData?.description}
                </p>
              </div>
              <Badge variant="outline" size="lg">
                {currentPlanData?.price}
              </Badge>
            </div>
          </div>

          {/* Plans Comparison */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isCurrentPlan = plan.id === currentPlan;
                const isSelected = plan.id === selectedPlan;
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`relative ${isCurrentPlan ? 'opacity-60' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge variant="primary" className="px-3 py-1">
                          Mais Popular
                        </Badge>
                      </div>
                    )}
                    
                    <Card 
                      className={`p-6 h-full cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50 shadow-lg' 
                          : 'border-secondary-200 hover:border-primary-300 hover:shadow-md'
                      } ${isCurrentPlan ? 'cursor-not-allowed' : ''}`}
                      onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                    >
                      <div className="text-center mb-6">
                        <div className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <Icon className={`h-8 w-8 ${plan.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-secondary-900 mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-secondary-600 mb-4">
                          {plan.description}
                        </p>
                        <div className="text-3xl font-bold text-secondary-900">
                          {plan.price}
                          <span className="text-lg text-secondary-600">
                            {plan.period}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-secondary-700">
                              {feature}
                            </span>
                          </div>
                        ))}
                        
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span className="text-sm text-secondary-500 line-through">
                              {limitation}
                            </span>
                          </div>
                        ))}
                      </div>

                      {isCurrentPlan ? (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          disabled
                        >
                          Plano Atual
                        </Button>
                      ) : (
                        <Button 
                          variant={isSelected ? 'default' : 'outline'}
                          className="w-full"
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          {isSelected ? 'Selecionado' : 'Selecionar'}
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Selected Plan Details */}
          {selectedPlanData && selectedPlan !== currentPlan && (
            <div className="p-6 border-t border-secondary-200 bg-secondary-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Upgrade para {selectedPlanData.name}
                  </h3>
                  <p className="text-secondary-600">
                    Você terá acesso a todos os recursos do plano {selectedPlanData.name}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-secondary-600">Valor mensal</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {selectedPlanData.price}
                    </p>
                  </div>
                  <Button 
                    onClick={handleUpgrade}
                    className="px-8"
                    disabled={loading}
                  >
                    {loading ? 'Carregando...' : 'Fazer Upgrade'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="p-6 border-t border-secondary-200">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Por que fazer upgrade?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Segurança</h4>
                  <p className="text-sm text-secondary-600">Backup automático dos seus dados</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Relatórios</h4>
                  <p className="text-sm text-secondary-600">Análises detalhadas dos seus projetos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Suporte</h4>
                  <p className="text-sm text-secondary-600">Atendimento prioritário e treinamento</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpgradeModal;
