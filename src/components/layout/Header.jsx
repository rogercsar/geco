import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Shield,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

import Button from '../ui/Button';
import NotificationsModal from '../ui/NotificationsModal';
import { formatCurrency } from '../../utils/format';

const Header = ({ onMenuToggle, isMenuOpen, onNewBudget }) => {
  const { currentUser, isAdmin } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Menu Mobile */}
          <div className="flex items-center gap-2">
             <Button
               variant="ghost"
               size="icon"
               onClick={onMenuToggle}
               className="lg:hidden"
             >
               {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             </Button>
             <div className="px-2 py-1 rounded-md text-xs bg-secondary-100 text-secondary-700 border border-secondary-200">
               Plano: {currentUser?.plano || 'básico'}
             </div>
           </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Buscar orçamentos, materiais..."
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* User Info - Simplified */}
          <div className="flex items-center space-x-4">
            {/* Global New Budget */}
            <Button 
              onClick={onNewBudget}
              className="hidden md:inline-flex"
            >
              + Novo Orçamento
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Info - Desktop Only */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-secondary-900">
                  {currentUser?.nome?.split(' ')[0] || 'Usuário'}
                </p>
                <p className="text-xs text-secondary-500 capitalize">
                  {currentUser?.plano || 'básico'}
                </p>
              </div>
              {isAdmin && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  <Shield className="h-3 w-3" />
                  <span>Admin</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
};

export default Header;
