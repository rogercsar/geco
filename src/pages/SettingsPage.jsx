import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Bell, Shield, Palette, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage = ({ onPageChange }) => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      budgetUpdates: true,
      newFeatures: true
    },
    appearance: {
      theme: 'light',
      language: 'pt-BR'
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false
    }
  });

  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handleAppearanceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Aqui você salvaria as configurações no backend
    alert('Configurações salvas com sucesso!');
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
              Configurações
            </h1>
            <p className="text-secondary-600">
              Personalize sua experiência na plataforma
            </p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notificações */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-secondary-900">
              Notificações
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-secondary-900">Notificações por Email</p>
                <p className="text-sm text-secondary-600">Receba atualizações importantes por email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-secondary-900">Notificações Push</p>
                <p className="text-sm text-secondary-600">Receba notificações no navegador</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-secondary-900">Atualizações de Orçamento</p>
                <p className="text-sm text-secondary-600">Notifique sobre mudanças nos orçamentos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.budgetUpdates}
                  onChange={(e) => handleNotificationChange('budgetUpdates', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Aparência */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-secondary-900">
              Aparência
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tema
              </label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                className="w-full p-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Idioma
              </label>
              <select
                value={settings.appearance.language}
                onChange={(e) => handleAppearanceChange('language', e.target.value)}
                className="w-full p-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Privacidade */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-secondary-900">
              Privacidade
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Visibilidade do Perfil
              </label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                className="w-full p-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="private">Privado</option>
                <option value="public">Público</option>
                <option value="contacts">Apenas Contatos</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-secondary-900">Compartilhamento de Dados</p>
                <p className="text-sm text-secondary-600">Permitir uso de dados para melhorias</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.dataSharing}
                  onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Informações da Conta */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Informações da Conta
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm font-medium text-secondary-700">Plano Atual</p>
              <p className="text-lg font-semibold text-primary-600 capitalize">
                {currentUser?.plano || 'Básico'}
              </p>
            </div>
            
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm font-medium text-secondary-700">Tipo de Usuário</p>
              <p className="text-lg font-semibold text-secondary-900">
                {currentUser?.isAdmin ? 'Administrador' : 'Usuário'}
              </p>
            </div>
            
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm font-medium text-secondary-700">Membro desde</p>
              <p className="text-lg font-semibold text-secondary-900">
                {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default SettingsPage;

