import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  Star,
  Download,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBudget } from '../contexts/BudgetContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatCurrency, formatDate } from '../utils/format';
import { toast } from 'react-hot-toast';
import { canCreateNewBudget, getBudgetLimit } from '../utils/planGuard';
import UpgradeModal from '../components/ui/UpgradeModal';
import { showUpgradeToast } from '../utils/upgradeToast';
import Progress from '../components/ui/Progress';

const DashboardPage = ({ onPageChange }) => {
  const { currentUser } = useAuth();
  const { getBudgetsByUser, deleteBudget, loading: budgetLoading } = useBudget();
  const [budgets, setBudgets] = useState([]);
  const [stats, setStats] = useState({
    totalBudgets: 0,
    totalValue: 0,
    thisMonth: 0,
    averageValue: 0
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (currentUser && !budgetLoading) {
      const userBudgets = getBudgetsByUser(currentUser.id);
      setBudgets(userBudgets);
      
      // Calcular estatísticas
      const totalValue = userBudgets.reduce((sum, budget) => sum + (budget.total || 0), 0);
      const thisMonth = userBudgets.filter(budget => {
        const budgetDate = new Date(budget.createdAt);
        const now = new Date();
        return budgetDate.getMonth() === now.getMonth() && 
               budgetDate.getFullYear() === now.getFullYear();
      }).reduce((sum, budget) => sum + (budget.total || 0), 0);
      
      setStats({
        totalBudgets: userBudgets.length,
        totalValue,
        thisMonth,
        averageValue: userBudgets.length > 0 ? totalValue / userBudgets.length : 0
      });
    }
  }, [currentUser, getBudgetsByUser, budgetLoading]);

  const handleViewBudget = (budgetId) => {
    // Implementar visualização do orçamento
    console.log('Visualizar orçamento:', budgetId);
    // TODO: Implementar modal de visualização
  };

  const handleEditBudget = (budgetId) => {
    // Implementar edição do orçamento
    console.log('Editar orçamento:', budgetId);
    // TODO: Implementar edição do orçamento
  };

  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        const result = await deleteBudget(budgetId);
        if (result.success) {
          const userBudgets = getBudgetsByUser(currentUser.id);
          setBudgets(userBudgets);
          const totalValue = userBudgets.reduce((sum, budget) => sum + (budget.total || 0), 0);
          const thisMonth = userBudgets.filter(budget => {
            const budgetDate = new Date(budget.createdAt);
            const now = new Date();
            return budgetDate.getMonth() === now.getMonth() && budgetDate.getFullYear() === now.getFullYear();
          }).reduce((sum, budget) => sum + (budget.total || 0), 0);
          setStats({
            totalBudgets: userBudgets.length,
            totalValue,
            thisMonth,
            averageValue: userBudgets.length > 0 ? totalValue / userBudgets.length : 0
          });
        }
      } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
      }
    }
  };

  const handleCreateNewBudget = () => {
    const userBudgetsCount = budgets.length;
    if (canCreateNewBudget(currentUser, userBudgetsCount)) {
      onPageChange('new-budget');
    } else {
      const limit = getBudgetLimit(currentUser);
      showUpgradeToast(limit, () => setShowUpgradeModal(true));
    }
  };
  const recentBudgets = budgets.slice(0, 5);

  const statCards = [
    {
      title: 'Total de Orçamentos',
      value: stats.totalBudgets,
      icon: <FileText className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Valor Total',
      value: formatCurrency(stats.totalValue),
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Este Mês',
      value: formatCurrency(stats.thisMonth),
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Valor Médio',
      value: formatCurrency(stats.averageValue),
      icon: <Calendar className="h-6 w-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  // Usage metrics for plan limits
  const budgetLimit = getBudgetLimit(currentUser);
  const usedBudgets = budgets.length;
  const usagePercent = budgetLimit ? Math.min((usedBudgets / budgetLimit) * 100, 100) : 100;
  const isBasicPlan = currentUser?.plano === 'basico';

  if (budgetLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Olá, {currentUser?.nome?.split(' ')[0] || 'Usuário'}!
          </h1>
          <p className="text-secondary-600 mt-1">
            Aqui está um resumo dos seus orçamentos
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={handleCreateNewBudget}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-secondary-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Usage Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-secondary-900">Uso de Orçamentos</h2>
            <p className="text-sm text-secondary-600 mt-1">
              {budgetLimit
                ? `Você usou ${usedBudgets} de ${budgetLimit} orçamentos neste mês.`
                : 'Você possui orçamentos ilimitados no seu plano.'}
            </p>
            <div className="mt-4">
              <Progress value={usagePercent} size="lg" />
            </div>
          </div>
          {isBasicPlan && (
            <div className="flex-shrink-0">
              <Button onClick={() => setShowUpgradeModal(true)}>
                Fazer Upgrade
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Budgets */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-secondary-900">
                  Orçamentos Recentes
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange('budgets')}
                >
                  Ver todos
                </Button>
              </div>
            </div>
            <div className="p-6">
              {recentBudgets.length > 0 ? (
                <div className="space-y-4">
                  {recentBudgets.map((budget, index) => (
                    <motion.div
                      key={budget.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900">
                          {budget.info?.nomeProjeto || 'Orçamento sem nome'}
                        </h3>
                        <p className="text-sm text-secondary-600 mt-1">
                          Cliente: {budget.info?.nomeCliente || 'N/A'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-secondary-500">
                            {formatDate(budget.createdAt)}
                          </span>
                          <Badge variant="outline" size="sm">
                            {budget.info?.tipoObra || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary-600">
                          {formatCurrency(budget.total || 0)}
                        </span>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewBudget(budget.id)}
                            title="Visualizar orçamento"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditBudget(budget.id)}
                            title="Editar orçamento"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteBudget(budget.id)}
                            title="Excluir orçamento"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    Nenhum orçamento encontrado
                  </h3>
                  <p className="text-secondary-600 mb-6">
                    Comece criando seu primeiro orçamento
                  </p>
                  <Button onClick={handleCreateNewBudget}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Orçamento
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">
                Ações Rápidas
              </h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleCreateNewBudget}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Orçamento
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onPageChange('favorites')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Ver Favoritos
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onPageChange('reports')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">
                Plano Atual
              </h2>
              <div className="text-center">
                <Badge 
                  variant={currentUser?.plano === 'empresarial' ? 'primary' : 'default'}
                  className="mb-2"
                >
                  {currentUser?.plano?.toUpperCase() || 'BÁSICO'}
                </Badge>
                <p className="text-sm text-secondary-600 mb-4">
                  {currentUser?.plano === 'basico' && 'Funcionalidades essenciais'}
                  {currentUser?.plano === 'pro' && 'Para profissionais autônomos'}
                  {currentUser?.plano === 'empresarial' && 'Para construtoras e escritórios'}
                </p>
                {currentUser?.plano === 'basico' && (
                  <Button size="sm" className="w-full">
                    Fazer Upgrade
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={currentUser?.plano}
      />
    </div>
  );
};

export default DashboardPage;