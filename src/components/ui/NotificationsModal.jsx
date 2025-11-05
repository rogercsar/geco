import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Star,
  Calendar,
  DollarSign
} from 'lucide-react';
import Button from './Button';
import Card from './Card';
import Badge from './Badge';

const NotificationsModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Orçamento salvo com sucesso',
      message: 'Seu orçamento "Casa Residencial" foi salvo e está disponível na sua lista.',
      time: '2 horas atrás',
      read: false,
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'info',
      title: 'Novo material disponível',
      message: 'Adicionamos novos materiais de acabamento à nossa base de dados.',
      time: '1 dia atrás',
      read: false,
      icon: Info
    },
    {
      id: 3,
      type: 'warning',
      title: 'Atualização de preços',
      message: 'Os preços dos materiais foram atualizados. Revise seus orçamentos.',
      time: '3 dias atrás',
      read: true,
      icon: AlertCircle
    },
    {
      id: 4,
      type: 'success',
      title: 'Upgrade de plano disponível',
      message: 'Desbloqueie recursos exclusivos com nosso plano Pro.',
      time: '1 semana atrás',
      read: true,
      icon: Star
    },
    {
      id: 5,
      type: 'info',
      title: 'Relatório mensal disponível',
      message: 'Seu relatório de orçamentos do mês passado está pronto.',
      time: '2 semanas atrás',
      read: true,
      icon: Calendar
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, unread, read

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-secondary-600" />;
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-secondary-50 border-secondary-200';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
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
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Bell className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900">
                    Notificações
                  </h2>
                  <p className="text-sm text-secondary-600">
                    {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                  >
                    Marcar todas como lidas
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-secondary-200">
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Todas ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Não lidas ({unreadCount})
              </Button>
              <Button
                variant={filter === 'read' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('read')}
              >
                Lidas ({notifications.length - unreadCount})
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              <div className="p-4 space-y-3">
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      notification.read 
                        ? 'bg-white border-secondary-200' 
                        : `${getNotificationBg(notification.type)} border-l-4`
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              notification.read ? 'text-secondary-700' : 'text-secondary-900'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className={`text-sm mt-1 ${
                              notification.read ? 'text-secondary-500' : 'text-secondary-600'
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-secondary-400">
                                {notification.time}
                              </span>
                              {!notification.read && (
                                <Badge variant="primary" size="sm">
                                  Nova
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                title="Marcar como lida"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              title="Excluir notificação"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  Nenhuma notificação
                </h3>
                <p className="text-secondary-600">
                  {filter === 'unread' 
                    ? 'Você não tem notificações não lidas'
                    : filter === 'read'
                    ? 'Você não tem notificações lidas'
                    : 'Você não tem notificações'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-secondary-200 bg-secondary-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-600">
                Total: {notifications.length} notificações
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Fechar
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationsModal;
