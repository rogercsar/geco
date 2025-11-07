import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/authSlice';
import { 
  Home, 
  Plus, 
  FileText, 
  Star, 
  BarChart3, 
  Settings,
  Shield,
  ChevronRight,
  User,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.is_admin;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/'
    },
    {
      id: 'new-budget',
      label: 'Novo Orçamento',
      icon: <Plus className="h-5 w-5" />,
      path: '/new-budget'
    },
    {
      id: 'budgets',
      label: 'Meus Orçamentos',
      icon: <FileText className="h-5 w-5" />,
      path: '/budgets'
    },
    {
      id: 'favorites',
      label: 'Favoritos',
      icon: <Star className="h-5 w-5" />,
      path: '/favorites'
    },
    {
      id: 'simulation',
      label: 'Simular Cômodo',
      icon: <Eye className="h-5 w-5" />,
      path: '/simulation'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/reports'
    }
  ];

  const adminItems = [
    {
      id: 'admin',
      label: 'Painel Admin',
      icon: <Shield className="h-5 w-5" />,
      path: '/admin'
    }
  ];


  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  return (
    <>
      {/* Overlay apenas para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-secondary-900">Geco</h2>
                <p className="text-xs text-secondary-500">Construção Civil</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-secondary-700 hover:bg-secondary-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {location.pathname === item.path && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Link>
              ))}
            </div>

            {/* Admin Section */}
            {isAdmin && (
              <div className="mt-8">
                <div className="flex items-center space-x-2 px-3 py-2 mb-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                    Administração
                  </span>
                </div>
                <div className="space-y-1">
                  {adminItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={onClose}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'bg-red-100 text-red-700'
                          : 'text-secondary-700 hover:bg-red-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {location.pathname === item.path && (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-secondary-200">
            <div className="space-y-2">
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-secondary-500 truncate">
                    {user?.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {user?.plan || 'básico'}
                    </span>
                    {isAdmin && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Actions */}
              <div className="space-y-1">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="w-full flex items-center px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4 mr-3" />
                  Meu Perfil
                </Link>
                <Link
                  to="/settings"
                  onClick={onClose}
                  className="w-full flex items-center px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Configurações
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sair
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 pb-4">
            <div className="text-xs text-secondary-500 text-center">
              <p>Geco v1.0.0</p>
              <p>© 2024 Todos os direitos reservados</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

