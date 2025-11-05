import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Building2, BarChart3, Settings, Shield, Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import AddUserForm from './admin/AddUserForm';
import AddCompanyForm from './admin/AddCompanyForm';
import UserProfileModal from './admin/UserProfileModal';
import CompanyProfileModal from './admin/CompanyProfileModal';

const AdminPage = ({ onPageChange }) => {
  const { currentUser, users, deleteUser } = useAuth();
  const { companies, deleteCompany } = useCompany();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Estados para modais
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [showCompanyProfileModal, setShowCompanyProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showDeleteCompanyModal, setShowDeleteCompanyModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  
  // Estados para busca
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [companySearchTerm, setCompanySearchTerm] = useState('');

  const adminTabs = [
    { id: 'overview', label: 'Visão Geral', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'users', label: 'Usuários', icon: <Users className="h-4 w-4" /> },
    { id: 'companies', label: 'Empresas', icon: <Building2 className="h-4 w-4" /> },
    { id: 'budget-settings', label: 'Config. Orçamento', icon: <Package className="h-4 w-4" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="h-4 w-4" /> }
  ];

  const stats = [
    { label: 'Total de Usuários', value: users.length.toString(), change: '+12%', color: 'text-blue-600' },
    { label: 'Orçamentos Criados', value: '5,678', change: '+8%', color: 'text-green-600' },
    { label: 'Empresas Ativas', value: companies.length.toString(), change: '+3%', color: 'text-purple-600' },
    { label: 'Receita Mensal', value: 'R$ 45.678', change: '+15%', color: 'text-orange-600' }
  ];

  // Funções auxiliares
  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.profissao.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredCompanies = companies.filter(company =>
    company.nome.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
    company.categoria.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
    company.responsavel.toLowerCase().includes(companySearchTerm.toLowerCase())
  );

  const handleViewUserProfile = (user) => {
    setSelectedUser(user);
    setShowUserProfileModal(true);
  };

  const handleViewCompanyProfile = (company) => {
    setSelectedCompany(company);
    setShowCompanyProfileModal(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteUserModal(true);
  };

  const handleDeleteCompany = (company) => {
    setCompanyToDelete(company);
    setShowDeleteCompanyModal(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setShowDeleteUserModal(false);
      setUserToDelete(null);
    }
  };

  const confirmDeleteCompany = () => {
    if (companyToDelete) {
      deleteCompany(companyToDelete.id);
      setShowDeleteCompanyModal(false);
      setCompanyToDelete(null);
    }
  };

  const getPlanBadgeColor = (plano) => {
    switch (plano) {
      case 'empresarial':
        return 'bg-purple-100 text-purple-800';
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      case 'basico':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (isAdmin) => {
    return isAdmin ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
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

  const getCompanyStatusBadgeColor = (status) => {
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
                        <p className={`text-sm font-medium ${stat.color} mt-1`}>{stat.change}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Usuários Recentes
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'João Silva', email: 'joao@email.com', plan: 'Pro', date: '2024-01-15' },
                    { name: 'Maria Santos', email: 'maria@email.com', plan: 'Básico', date: '2024-01-14' },
                    { name: 'Pedro Costa', email: 'pedro@email.com', plan: 'Empresarial', date: '2024-01-13' }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div>
                        <p className="font-medium text-secondary-900">{user.name}</p>
                        <p className="text-sm text-secondary-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-primary-600 capitalize">{user.plan}</span>
                        <p className="text-xs text-secondary-500">{user.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Atividade Recente
                </h3>
                <div className="space-y-3">
                  {[
                    { action: 'Novo orçamento criado', user: 'João Silva', time: '2 min atrás' },
                    { action: 'Usuário cadastrado', user: 'Maria Santos', time: '15 min atrás' },
                    { action: 'Orçamento exportado', user: 'Pedro Costa', time: '1 hora atrás' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900">{activity.action}</p>
                        <p className="text-xs text-secondary-600">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            {/* Header com busca e botão adicionar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <Button onClick={() => setShowAddUserModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Usuário
              </Button>
            </div>

            {/* Lista de usuários */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Plano
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-secondary-200">
                    {filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-secondary-50"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-600">
                                  {user.nome.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-secondary-900">
                                {user.nome}
                              </div>
                              <div className="text-sm text-secondary-500">
                                {user.profissao}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-secondary-900">{user.email}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanBadgeColor(user.plano)}`}>
                            {user.plano}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.isAdmin)}`}>
                            {user.isAdmin ? 'Admin' : 'Usuário'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewUserProfile(user)}
                              title="Ver perfil"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* TODO: Implementar edição */}}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              title="Excluir"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-secondary-400" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    Nenhum usuário encontrado
                  </h3>
                  <p className="text-secondary-500">
                    {userSearchTerm ? 'Tente ajustar os termos de busca.' : 'Comece adicionando um novo usuário.'}
                  </p>
                </div>
              )}
            </Card>
          </div>
        );

      case 'companies':
        return (
          <div className="space-y-6">
            {/* Header com busca e botão adicionar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Buscar empresas..."
                  value={companySearchTerm}
                  onChange={(e) => setCompanySearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <Button onClick={() => setShowAddCompanyModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Empresa
              </Button>
            </div>

            {/* Lista de empresas */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Empresa
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Produtos
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-secondary-200">
                    {filteredCompanies.map((company) => (
                      <motion.tr
                        key={company.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-secondary-50"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-primary-600" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-secondary-900">
                                {company.nome}
                              </div>
                              <div className="text-sm text-secondary-500">
                                {company.cnpj}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-secondary-900">{company.email}</div>
                          <div className="text-sm text-secondary-500">{company.telefone}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeColor(company.categoria)}`}>
                            {company.categoria}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-secondary-900">
                            <Package className="h-4 w-4 mr-1" />
                            {company.produtos?.length || 0}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCompanyStatusBadgeColor(company.status)}`}>
                            {company.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewCompanyProfile(company)}
                              title="Ver perfil"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* TODO: Implementar edição */}}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCompany(company)}
                              title="Excluir"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCompanies.length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-secondary-400" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    Nenhuma empresa encontrada
                  </h3>
                  <p className="text-secondary-500">
                    {companySearchTerm ? 'Tente ajustar os termos de busca.' : 'Comece adicionando uma nova empresa.'}
                  </p>
                </div>
              )}
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            {/* Configurações Gerais */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Configurações Gerais
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-secondary-900">Modo de Orçamento</h4>
                    <p className="text-sm text-secondary-600">Escolha o modo padrão para criação de orçamentos</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Casa Completa</Button>
                    <Button size="sm">Por Cômodos</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-secondary-900">Notificações por Email</h4>
                    <p className="text-sm text-secondary-600">Enviar notificações quando novos orçamentos são criados</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-secondary-900">Backup Automático</h4>
                    <p className="text-sm text-secondary-600">Fazer backup dos dados diariamente</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </Card>

            {/* Configurações de Orçamento */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Configurações de Orçamento
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Margem de Lucro Padrão (%)
                  </label>
                  <input
                    type="number"
                    className="w-32 px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    defaultValue="20"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Prazo de Validade do Orçamento (dias)
                  </label>
                  <input
                    type="number"
                    className="w-32 px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    defaultValue="30"
                    min="1"
                    max="365"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Moeda Padrão
                  </label>
                  <select className="w-32 px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="BRL">BRL (R$)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Configurações de Sistema */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Configurações de Sistema
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-secondary-900">Manutenção do Sistema</h4>
                    <p className="text-sm text-secondary-600">Sistema em modo de manutenção</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-secondary-900">Logs de Auditoria</h4>
                    <p className="text-sm text-secondary-600">Registrar todas as ações dos usuários</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="pt-4 border-t border-secondary-200">
                  <div className="flex space-x-3">
                    <Button variant="outline">
                      Exportar Configurações
                    </Button>
                    <Button variant="outline">
                      Importar Configurações
                    </Button>
                    <Button>
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'budget-settings':
        return <BudgetSettingsContent onPageChange={onPageChange} />;

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => onPageChange('dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Painel Administrativo
            </h1>
            <p className="text-secondary-600">
              Gerencie usuários, empresas e configurações do sistema
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          <Shield className="h-4 w-4" />
          <span>Admin</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="flex overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 sm:space-x-8 min-w-max">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>

      {/* Modals */}
      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Adicionar Novo Usuário"
        size="lg"
      >
        <AddUserForm
          onSuccess={() => setShowAddUserModal(false)}
          onCancel={() => setShowAddUserModal(false)}
        />
      </Modal>

      {/* Add Company Modal */}
      <Modal
        isOpen={showAddCompanyModal}
        onClose={() => setShowAddCompanyModal(false)}
        title="Adicionar Nova Empresa"
        size="xl"
      >
        <AddCompanyForm
          onSuccess={() => setShowAddCompanyModal(false)}
          onCancel={() => setShowAddCompanyModal(false)}
        />
      </Modal>

      {/* User Profile Modal */}
      <Modal
        isOpen={showUserProfileModal}
        onClose={() => setShowUserProfileModal(false)}
        title="Perfil do Usuário"
        size="lg"
      >
        {selectedUser && (
          <UserProfileModal
            user={selectedUser}
            onClose={() => setShowUserProfileModal(false)}
          />
        )}
      </Modal>

      {/* Company Profile Modal */}
      <Modal
        isOpen={showCompanyProfileModal}
        onClose={() => setShowCompanyProfileModal(false)}
        title="Perfil da Empresa"
        size="xl"
      >
        {selectedCompany && (
          <CompanyProfileModal
            company={selectedCompany}
            onClose={() => setShowCompanyProfileModal(false)}
          />
        )}
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal
        isOpen={showDeleteUserModal}
        onClose={() => setShowDeleteUserModal(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-secondary-600">
            Tem certeza que deseja excluir o usuário <strong>{userToDelete?.nome}</strong>?
          </p>
          <p className="text-sm text-secondary-500">
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteUserModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteUser}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Company Confirmation Modal */}
      <Modal
        isOpen={showDeleteCompanyModal}
        onClose={() => setShowDeleteCompanyModal(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-secondary-600">
            Tem certeza que deseja excluir a empresa <strong>{companyToDelete?.nome}</strong>?
          </p>
          <p className="text-sm text-secondary-500">
            Esta ação não pode ser desfeita e todos os produtos da empresa serão removidos.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteCompanyModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteCompany}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

// Componente para configurações do orçamento
const BudgetSettingsContent = ({ onPageChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">
            Configurações do Orçamento
          </h2>
          <p className="text-secondary-600 mt-1">
            Personalize o layout e visual dos orçamentos
          </p>
        </div>
        <Button
          onClick={() => onPageChange('budget-settings')}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <Settings className="h-4 w-4 mr-2" />
          Abrir Configurações
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Layout</h3>
              <p className="text-sm text-secondary-600">Elementos visuais</p>
            </div>
          </div>
          <p className="text-sm text-secondary-600 mb-4">
            Configure quais elementos aparecem no orçamento: logo, assinatura, fornecedores, etc.
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Configurar Layout
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Empresa</h3>
              <p className="text-sm text-secondary-600">Informações e logo</p>
            </div>
          </div>
          <p className="text-sm text-secondary-600 mb-4">
            Adicione informações da sua empresa e faça upload do logo para personalizar os orçamentos.
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Configurar Empresa
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Assinatura</h3>
              <p className="text-sm text-secondary-600">Upload ou texto</p>
            </div>
          </div>
          <p className="text-sm text-secondary-600 mb-4">
            Configure a assinatura que aparecerá no final dos orçamentos.
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Configurar Assinatura
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">
              Acesso Rápido
            </h3>
            <p className="text-sm text-secondary-600">
              Acesse todas as configurações do orçamento em uma interface dedicada
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-secondary-50 rounded-lg">
            <h4 className="font-medium text-secondary-900 mb-2">Funcionalidades Disponíveis</h4>
            <ul className="text-sm text-secondary-600 space-y-1">
              <li>• Personalização de layout</li>
              <li>• Upload de logo da empresa</li>
              <li>• Configuração de assinatura</li>
              <li>• Esquemas de cores personalizados</li>
              <li>• Controle de elementos visuais</li>
            </ul>
          </div>
          
          <div className="p-4 bg-secondary-50 rounded-lg">
            <h4 className="font-medium text-secondary-900 mb-2">Como Usar</h4>
            <ol className="text-sm text-secondary-600 space-y-1">
              <li>1. Clique em "Abrir Configurações"</li>
              <li>2. Configure cada seção conforme necessário</li>
              <li>3. Salve as alterações</li>
              <li>4. Os orçamentos usarão as novas configurações</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminPage;
