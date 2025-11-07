import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  Share2,
  Calendar,
  DollarSign,
  Building2,
  Users,
  Activity,
  Plus,
  MoreVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useBudget } from '../contexts/BudgetContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { formatCurrency, formatDate } from '../utils/format';
import { exportToPDF, exportToExcel, exportToImage, shareReport } from '../utils/export';
import ShareBudgetModal from '../components/ui/ShareBudgetModal';
import { toast } from 'react-hot-toast';
import { canExportPDF, canCreateNewBudget, getBudgetLimit } from '../utils/planGuard';
import UpgradeModal from '../components/ui/UpgradeModal';
import { showUpgradeToast } from '../utils/upgradeToast';
import { UPGRADE_MESSAGES } from '../data/constants';
import { useNavigate } from 'react-router-dom';

const MyBudgetsPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { getBudgetsByUser, deleteBudget, duplicateBudget, loading: budgetLoading } = useBudget();
  const [budgets, setBudgets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBudgets, setSelectedBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Opções de filtro
  const typeOptions = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'materials', label: 'Materiais' },
    { value: 'labor', label: 'Mão de Obra' },
    { value: 'combined', label: 'Combinados' }
  ];

  const periodOptions = [
    { value: 'all', label: 'Todos os períodos' },
    { value: '7', label: 'Últimos 7 dias' },
    { value: '30', label: 'Últimos 30 dias' },
    { value: '90', label: 'Últimos 90 dias' },
    { value: '365', label: 'Último ano' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'active', label: 'Ativo' },
    { value: 'completed', label: 'Concluído' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'draft', label: 'Rascunho' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Data de Criação' },
    { value: 'updatedAt', label: 'Última Atualização' },
    { value: 'total', label: 'Valor Total' },
    { value: 'nomeProjeto', label: 'Nome do Projeto' },
    { value: 'nomeCliente', label: 'Nome do Cliente' }
  ];

  useEffect(() => {
    if (currentUser && !budgetLoading) {
      const userBudgets = getBudgetsByUser(currentUser.id);
      setBudgets(userBudgets);
    }
  }, [currentUser, getBudgetsByUser, budgetLoading]);

  // Filtrar e ordenar orçamentos
  const filteredAndSortedBudgets = useMemo(() => {
    let filtered = budgets;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(budget => 
        budget.info?.nomeProjeto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.info?.nomeCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.info?.tipoObra?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(budget => budget.budgetType === filterType);
    }

    // Filtrar por período
    if (filterPeriod !== 'all') {
      const days = parseInt(filterPeriod);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(budget => {
        const budgetDate = new Date(budget.createdAt);
        return budgetDate >= cutoffDate;
      });
    }

    // Filtrar por status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(budget => budget.status === filterStatus);
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'createdAt':
        case 'updatedAt':
          aValue = new Date(a[sortBy]);
          bValue = new Date(b[sortBy]);
          break;
        case 'total':
          aValue = a.total || 0;
          bValue = b.total || 0;
          break;
        case 'nomeProjeto':
          aValue = a.info?.nomeProjeto || '';
          bValue = b.info?.nomeProjeto || '';
          break;
        case 'nomeCliente':
          aValue = a.info?.nomeCliente || '';
          bValue = b.info?.nomeCliente || '';
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [budgets, searchTerm, filterType, filterPeriod, filterStatus, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectBudget = (budgetId) => {
    setSelectedBudgets(prev => 
      prev.includes(budgetId) 
        ? prev.filter(id => id !== budgetId)
        : [...prev, budgetId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBudgets.length === filteredAndSortedBudgets.length) {
      setSelectedBudgets([]);
    } else {
      setSelectedBudgets(filteredAndSortedBudgets.map(budget => budget.id));
    }
  };

  const handleViewBudget = (budgetId) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (budget) {
      // Criar uma nova página de visualização ou modal
      // Por enquanto, vamos mostrar um alert com as informações
      const budgetInfo = `
Projeto: ${budget.info?.nomeProjeto || 'N/A'}
Cliente: ${budget.info?.nomeCliente || 'N/A'}
Tipo: ${budget.budgetType || 'N/A'}
Valor Total: ${formatCurrency(budget.total || 0)}
Data: ${formatDate(budget.createdAt)}
Status: ${budget.status || 'Ativo'}
      `;
      alert(`Detalhes do Orçamento:\n\n${budgetInfo}`);
    }
  };

  const handleEditBudget = (budgetId) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (budget) {
      // Redirecionar para página de edição
      // Por enquanto, vamos mostrar um alert
      alert(`Funcionalidade de edição será implementada em breve!\n\nOrçamento: ${budget.info?.nomeProjeto || 'N/A'}`);
    }
  };

  const handleDuplicateBudget = async (budgetId) => {
    const userBudgetsCount = budgets.length;
    if (!canCreateNewBudget(currentUser, userBudgetsCount)) {
      const limit = getBudgetLimit(currentUser);
      showUpgradeToast(limit, () => setShowUpgradeModal(true));
      return;
    }

    setLoading(true);
    try {
      const result = await duplicateBudget(budgetId);
      if (result?.success) {
        const userBudgets = getBudgetsByUser(currentUser.id);
        setBudgets(userBudgets);
        toast.success('Orçamento duplicado com sucesso');
      } else {
        toast.error(result?.error || 'Erro ao duplicar orçamento');
      }
    } catch (error) {
      console.error('Erro ao duplicar orçamento:', error);
      toast.error('Erro ao duplicar orçamento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      setLoading(true);
      try {
        const result = await deleteBudget(budgetId);
        if (result.success) {
          setBudgets(prev => prev.filter(budget => budget.id !== budgetId));
          setSelectedBudgets(prev => prev.filter(id => id !== budgetId));
        }
      } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportBudget = (budgetId, format) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return;

    const filename = `${budget.info?.nomeProjeto || 'orcamento'}_${budgetId}`;
    
    switch (format) {
      case 'pdf':
        if (!canExportPDF(currentUser)) {
          showUpgradeToast(null, () => setShowUpgradeModal(true), 8000, UPGRADE_MESSAGES.export_pdf_blocked);
          return;
        }
        exportToPDF(budget, `${filename}.pdf`);
        break;
      case 'excel':
        exportToExcel(budget, `${filename}.xlsx`);
        break;
      case 'image':
        exportToImage(`budget-${budgetId}`, `${filename}.png`);
        break;
    }
  };

  const handleShareBudget = (budgetId) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (budget) {
      setSelectedBudget(budget);
      setShowShareModal(true);
    }
  };

  const handleCreateNewBudget = () => {
    const userBudgetsCount = budgets.length;
    if (canCreateNewBudget(currentUser, userBudgetsCount)) {
      navigate('/new-budget');
    } else {
       const limit = getBudgetLimit(currentUser);
       showUpgradeToast(limit, () => setShowUpgradeModal(true));
     }
   };
  const getBudgetTypeIcon = (type) => {
    switch (type) {
      case 'materials':
        return <Building2 className="h-4 w-4" />;
      case 'labor':
        return <Users className="h-4 w-4" />;
      case 'combined':
        return <Activity className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getBudgetTypeColor = (type) => {
    switch (type) {
      case 'materials':
        return 'bg-blue-100 text-blue-800';
      case 'labor':
        return 'bg-orange-100 text-orange-800';
      case 'combined':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (budgetLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Carregando orçamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <div className="text-sm text-secondary-600 mb-1">
            <button className="hover:text-secondary-900" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <span className="mx-2">/</span>
            <span className="text-secondary-900 font-medium">Meus Orçamentos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">
            Meus Orçamentos
          </h1>
          <p className="text-secondary-600 mt-1">
            Gerencie todos os seus orçamentos criados
          </p>
        </div>
        
        <Button onClick={handleCreateNewBudget}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total</p>
              <p className="text-2xl font-bold text-secondary-900">
                {budgets.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Valor Total</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(budgets.reduce((sum, budget) => sum + (budget.total || 0), 0))}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Este Mês</p>
              <p className="text-2xl font-bold text-secondary-900">
                {budgets.filter(budget => {
                  const budgetDate = new Date(budget.createdAt);
                  const now = new Date();
                  return budgetDate.getMonth() === now.getMonth() && 
                         budgetDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Selecionados</p>
              <p className="text-2xl font-bold text-secondary-900">
                {selectedBudgets.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <MoreVertical className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Barra de busca */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <Input
                  type="text"
                  placeholder="Buscar por projeto, cliente ou tipo de obra..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-secondary-200"
            >
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tipo
                </label>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Período
                </label>
                <Select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                >
                  {periodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Status
                </label>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Ordenar por
                </label>
                <div className="flex space-x-2">
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort(sortBy)}
                    className="px-3"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Lista de Orçamentos */}
      <Card className="p-4 sm:p-6">
        {filteredAndSortedBudgets.length > 0 ? (
          <div className="space-y-4">
            {/* Cabeçalho da tabela */}
            <div className="flex items-center justify-between pb-4 border-b border-secondary-200">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedBudgets.length === filteredAndSortedBudgets.length && filteredAndSortedBudgets.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-secondary-700">
                  Selecionar todos ({filteredAndSortedBudgets.length} orçamentos)
                </span>
              </div>
              
              {selectedBudgets.length > 0 && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar ({selectedBudgets.length})
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar ({selectedBudgets.length})
                  </Button>
                </div>
              )}
            </div>

            {/* Lista de orçamentos */}
            <div className="space-y-3">
              {filteredAndSortedBudgets.map((budget, index) => (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedBudgets.includes(budget.id)}
                      onChange={() => handleSelectBudget(budget.id)}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      {getBudgetTypeIcon(budget.budgetType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary-900 truncate">
                        {budget.info?.nomeProjeto || 'Orçamento sem nome'}
                      </h3>
                      <p className="text-sm text-secondary-600 truncate">
                        Cliente: {budget.info?.nomeCliente || 'N/A'}
                      </p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-secondary-500">
                          {formatDate(budget.createdAt)}
                        </span>
                        <Badge 
                          variant="outline" 
                          size="sm"
                          className={getBudgetTypeColor(budget.budgetType)}
                        >
                          {budget.budgetType || 'N/A'}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          size="sm"
                          className={getStatusColor(budget.status)}
                        >
                          {budget.status || 'Ativo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">
                        {formatCurrency(budget.total || 0)}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {budget.info?.tipoObra || 'N/A'}
                      </p>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewBudget(budget.id)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBudget(budget.id)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateBudget(budget.id)}
                        title="Duplicar"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportBudget(budget.id, 'pdf')}
                        title="Exportar PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareBudget(budget.id)}
                        title="Compartilhar"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBudget(budget.id)}
                        title="Excluir"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              {searchTerm || filterType !== 'all' || filterPeriod !== 'all' || filterStatus !== 'all'
                ? 'Nenhum orçamento encontrado'
                : 'Nenhum orçamento criado ainda'
              }
            </h3>
            <p className="text-secondary-600 mb-6">
              {searchTerm || filterType !== 'all' || filterPeriod !== 'all' || filterStatus !== 'all'
                ? 'Tente ajustar os filtros ou termo de busca'
                : 'Comece criando seu primeiro orçamento'
              }
            </p>
            <Button onClick={handleCreateNewBudget} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Orçamento
            </Button>
          </div>
        )}
      </Card>

      {/* Share Modal */}
      <ShareBudgetModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setSelectedBudget(null);
        }}
        budget={selectedBudget}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={currentUser?.plano}
      />
    </div>
  );
};

export default MyBudgetsPage;
