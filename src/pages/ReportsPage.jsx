import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart as PieChartIcon,
  Activity,
  Users,
  Building2,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Share2,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBudget } from '../contexts/BudgetContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import BarChart from '../components/ui/BarChart';
import PieChart from '../components/ui/PieChart';
import LineChart from '../components/ui/LineChart';
import { formatCurrency, formatDate } from '../utils/format';
import { exportToPDF, exportToExcel, exportToImage, shareReport } from '../utils/export';
import { toast } from 'react-hot-toast';
import { canExportPDF } from '../utils/planGuard';
import { canCreateNewBudget, getBudgetLimit } from '../utils/planGuard';
import UpgradeModal from '../components/ui/UpgradeModal';
import { showUpgradeToast } from '../utils/upgradeToast';
import { UPGRADE_MESSAGES } from '../data/constants';
import { useNavigate } from 'react-router-dom';

const ReportsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getBudgetsByUser, loading: budgetLoading } = useBudget();
  const [budgets, setBudgets] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Períodos disponíveis
  const periods = [
    { value: '7', label: 'Últimos 7 dias' },
    { value: '30', label: 'Últimos 30 dias' },
    { value: '90', label: 'Últimos 90 dias' },
    { value: '365', label: 'Último ano' },
    { value: 'all', label: 'Todos os períodos' }
  ];

  // Tipos de relatório
  const reportTypes = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'materials', label: 'Apenas Materiais' },
    { value: 'labor', label: 'Apenas Mão de Obra' },
    { value: 'combined', label: 'Combinados' }
  ];

  useEffect(() => {
    if (currentUser && !budgetLoading) {
      const userBudgets = getBudgetsByUser(currentUser.id);
      setBudgets(userBudgets);
    }
  }, [currentUser, getBudgetsByUser, budgetLoading]);

  const handleCreateNewBudget = () => {
    const userBudgetsCount = budgets.length;
    if (canCreateNewBudget(currentUser, userBudgetsCount)) {
      navigate('/new-budget');
    } else {
      const limit = getBudgetLimit(currentUser);
      showUpgradeToast(limit, () => setShowUpgradeModal(true));
    }
  };
  // Filtrar orçamentos baseado no período selecionado
  const filteredBudgets = useMemo(() => {
    let filtered = budgets;

    // Filtrar por período
    if (selectedPeriod !== 'all') {
      const days = parseInt(selectedPeriod);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(budget => {
        const budgetDate = new Date(budget.createdAt);
        return budgetDate >= cutoffDate;
      });
    }

    // Filtrar por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter(budget => budget.budgetType === selectedType);
    }

    return filtered;
  }, [budgets, selectedPeriod, selectedType]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalValue = filteredBudgets.reduce((sum, budget) => sum + (budget.totalValue || 0), 0);
    const totalCount = filteredBudgets.length;
    const averageValue = totalCount > 0 ? totalValue / totalCount : 0;

    // Calcular crescimento comparado ao período anterior
    const previousPeriodBudgets = budgets.filter(budget => {
      if (selectedPeriod === 'all') return false;
      const days = parseInt(selectedPeriod);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (days * 2));
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - days);
      
      const budgetDate = new Date(budget.createdAt);
      return budgetDate >= startDate && budgetDate < endDate;
    });

    const previousValue = previousPeriodBudgets.reduce((sum, budget) => sum + (budget.totalValue || 0), 0);
    const growth = previousValue > 0 ? ((totalValue - previousValue) / previousValue) * 100 : 0;

    // Estatísticas por tipo
    const materialsCount = filteredBudgets.filter(b => b.budgetType === 'materials').length;
    const laborCount = filteredBudgets.filter(b => b.budgetType === 'labor').length;
    const combinedCount = filteredBudgets.filter(b => b.budgetType === 'combined').length;

    // Valores por mês (últimos 6 meses)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthBudgets = filteredBudgets.filter(budget => {
        const budgetDate = new Date(budget.createdAt);
        return budgetDate >= monthStart && budgetDate <= monthEnd;
      });
      
      const monthValue = monthBudgets.reduce((sum, budget) => sum + (budget.totalValue || 0), 0);
      
      monthlyData.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        value: monthValue,
        count: monthBudgets.length
      });
    }

    return {
      totalValue,
      totalCount,
      averageValue,
      growth,
      materialsCount,
      laborCount,
      combinedCount,
      monthlyData
    };
  }, [filteredBudgets, budgets, selectedPeriod]);

  const handleRefresh = () => {
    setLoading(true);
    // Simular carregamento
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = (format) => {
    const filename = `relatorio_${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'pdf':
        if (!canExportPDF(currentUser)) {
          showUpgradeToast(null, () => setShowUpgradeModal(true), 8000, UPGRADE_MESSAGES.export_pdf_blocked);
          return;
        }
        exportToPDF(stats, `${filename}.pdf`);
        break;
      case 'excel':
        exportToExcel(stats, `${filename}.xlsx`);
        break;
      case 'image':
        exportToImage('reports-content', `${filename}.png`);
        break;
      default:
        console.log(`Formato de exportação não suportado: ${format}`);
    }
  };

  const handleShare = () => {
    shareReport(stats);
  };

  if (budgetLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="reports-content" className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <div className="text-sm text-secondary-600 mb-1">
            <button className="hover:text-secondary-900" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <span className="mx-2">/</span>
            <span className="text-secondary-900 font-medium">Relatórios</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">
            Relatórios
          </h1>
          <p className="text-secondary-600 mt-1">
            Análise detalhada dos seus orçamentos e performance
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="text-sm sm:text-base py-2 sm:py-3"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="text-sm sm:text-base py-2 sm:py-3"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleExport('excel')}
              className="text-sm sm:text-base py-2 sm:py-3"
            >
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleExport('image')}
              className="text-sm sm:text-base py-2 sm:py-3"
            >
              <Download className="h-4 w-4 mr-2" />
              Imagem
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="sticky top-16 z-20 bg-secondary-50/80 backdrop-blur supports-[backdrop-filter]:bg-secondary-50/60">
        <Card className="p-4 sm:p-6 shadow-sm border-b border-secondary-200">
      
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Período
            </label>
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Tipo de Orçamento
            </label>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Valor Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-secondary-900 mt-1">
                  {formatCurrency(stats.totalValue)}
                </p>
                <div className="flex items-center mt-2">
                  {stats.growth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stats.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(stats.growth).toFixed(1)}%
                  </span>
                  <span className="text-sm text-secondary-500 ml-1">vs período anterior</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total de Orçamentos</p>
                <p className="text-2xl sm:text-3xl font-bold text-secondary-900 mt-1">
                  {stats.totalCount}
                </p>
                <p className="text-sm text-secondary-500 mt-2">
                  {stats.averageValue > 0 ? `Média: ${formatCurrency(stats.averageValue)}` : 'Nenhum orçamento'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Materiais</p>
                <p className="text-2xl sm:text-3xl font-bold text-secondary-900 mt-1">
                  {stats.materialsCount}
                </p>
                <p className="text-sm text-secondary-500 mt-2">
                  {stats.totalCount > 0 ? `${((stats.materialsCount / stats.totalCount) * 100).toFixed(1)}% do total` : '0%'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Mão de Obra</p>
                <p className="text-2xl sm:text-3xl font-bold text-secondary-900 mt-1">
                  {stats.laborCount}
                </p>
                <p className="text-sm text-secondary-500 mt-2">
                  {stats.totalCount > 0 ? `${((stats.laborCount / stats.totalCount) * 100).toFixed(1)}% do total` : '0%'}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Gráfico de Evolução Mensal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                Evolução Mensal
              </h3>
              <p className="text-sm text-secondary-600">
                Valor total dos orçamentos por mês
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                className="text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="text-xs sm:text-sm"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Compartilhar
              </Button>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <div className="mb-6">
            <BarChart
              data={stats.monthlyData.map(month => ({
                label: month.month,
                value: month.value
              }))}
              height={200}
              color="#3b82f6"
              showValues={true}
            />
          </div>

          {/* Tabela de dados */}
          <div className="space-y-2">
            {stats.monthlyData.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <span className="text-sm font-medium text-secondary-700">
                  {month.month}
                </span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-secondary-900">
                    {formatCurrency(month.value)}
                  </span>
                  <span className="text-xs text-secondary-500 ml-2">
                    ({month.count} orçamentos)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Distribuição por Tipo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                Distribuição por Tipo
              </h3>
              <p className="text-sm text-secondary-600">
                Proporção de cada tipo de orçamento
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gráfico de Pizza */}
            <div className="flex justify-center">
              <PieChart
                data={[
                  { label: 'Materiais', value: stats.materialsCount },
                  { label: 'Mão de Obra', value: stats.laborCount },
                  { label: 'Combinados', value: stats.combinedCount }
                ]}
                size={200}
                colors={['#3b82f6', '#f59e0b', '#10b981']}
                showLegend={true}
              />
            </div>

            {/* Cards de Estatísticas */}
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-secondary-900">Materiais</h4>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.materialsCount}</p>
                <p className="text-sm text-secondary-600">
                  {stats.totalCount > 0 ? `${((stats.materialsCount / stats.totalCount) * 100).toFixed(1)}%` : '0%'}
                </p>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-secondary-900">Mão de Obra</h4>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.laborCount}</p>
                <p className="text-sm text-secondary-600">
                  {stats.totalCount > 0 ? `${((stats.laborCount / stats.totalCount) * 100).toFixed(1)}%` : '0%'}
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-secondary-900">Combinados</h4>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.combinedCount}</p>
                <p className="text-sm text-secondary-600">
                  {stats.totalCount > 0 ? `${((stats.combinedCount / stats.totalCount) * 100).toFixed(1)}%` : '0%'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Orçamentos Recentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                Orçamentos Recentes
              </h3>
              <p className="text-sm text-secondary-600">
                Últimos orçamentos criados no período selecionado
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/budgets')}
              className="text-sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Todos
            </Button>
          </div>

          {filteredBudgets.length > 0 ? (
            <div className="space-y-3">
              {filteredBudgets.slice(0, 5).map((budget, index) => (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900">
                        {budget.info?.nomeProjeto || 'Orçamento sem nome'}
                      </h4>
                      <p className="text-sm text-secondary-600">
                        {formatDate(budget.createdAt)} • {budget.budgetType || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-secondary-900">
                      {formatCurrency(budget.totalValue || 0)}
                    </p>
                    <Badge variant="secondary" size="sm">
                      {budget.status || 'Ativo'}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Nenhum orçamento encontrado
              </h3>
              <p className="text-secondary-600 mb-6">
                Ajuste os filtros ou crie novos orçamentos
              </p>
              <Button onClick={handleCreateNewBudget} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Criar Orçamento
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    <UpgradeModal
      isOpen={showUpgradeModal}
      onClose={() => setShowUpgradeModal(false)}
      currentPlan={currentUser?.plano}
    />
    </div>
  );
};

export default ReportsPage;
