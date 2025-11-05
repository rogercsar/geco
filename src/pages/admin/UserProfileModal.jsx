import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Briefcase, Shield, Calendar, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const UserProfileModal = ({ user, onClose }) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-4 pb-6 border-b border-secondary-200">
        <div className="flex-shrink-0">
          <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {user.nome.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-secondary-900">{user.nome}</h2>
          <p className="text-secondary-600">{user.email}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanBadgeColor(user.plano)}`}>
              {user.plano}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.isAdmin)}`}>
              {user.isAdmin ? 'Administrador' : 'Usuário'}
            </span>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Informações Pessoais
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Nome</p>
                <p className="text-sm text-secondary-600">{user.nome}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Email</p>
                <p className="text-sm text-secondary-600">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Telefone</p>
                <p className="text-sm text-secondary-600">
                  {user.telefone || 'Não informado'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Profissão</p>
                <p className="text-sm text-secondary-600">{user.profissao}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Informações da Conta
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Plano</p>
                <p className="text-sm text-secondary-600 capitalize">{user.plano}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">Membro desde</p>
                <p className="text-sm text-secondary-600">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
            
            {user.updatedAt && user.updatedAt !== user.createdAt && (
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-secondary-400" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Última atualização</p>
                  <p className="text-sm text-secondary-600">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Estatísticas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">0</p>
            <p className="text-sm text-secondary-600">Orçamentos Criados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-sm text-secondary-600">Projetos Ativos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-sm text-secondary-600">Total Gastos</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
        <Button
          variant="ghost"
          onClick={onClose}
        >
          Fechar
        </Button>
        <Button>
          Editar Usuário
        </Button>
      </div>
    </motion.div>
  );
};

export default UserProfileModal;
