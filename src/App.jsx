import React, { useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { BudgetProvider } from './contexts/BudgetContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { BudgetSettingsProvider } from './contexts/BudgetSettingsContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import NewBudgetPage from './pages/budget/NewBudgetPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import FavoritesPage from './pages/FavoritesPage';
import BudgetSettingsPage from './pages/admin/BudgetSettingsPage';
import ReportsPage from './pages/ReportsPage';
import MyBudgetsPage from './pages/MyBudgetsPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const sidebarRef = useRef(null);

  // Verificar autenticação na inicialização
  useEffect(() => {
    const savedUser = localStorage.getItem('geco_current_user');
    if (savedUser) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);


  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
    localStorage.removeItem('geco_current_user');
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      if (showForgotPassword) {
        return <ForgotPasswordPage onBackToLogin={() => setShowForgotPassword(false)} />;
      }
      
      switch (currentPage) {
        case 'register':
          return <RegisterPage onSwitchToLogin={() => setCurrentPage('login')} />;
        case 'login':
        default:
          return (
            <LoginPage 
              onSwitchToRegister={() => setCurrentPage('register')} 
              onAuthSuccess={handleAuthSuccess}
              onForgotPassword={() => setShowForgotPassword(true)}
            />
          );
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onPageChange={handlePageChange} />;
      case 'new-budget':
        return <NewBudgetPage onPageChange={handlePageChange} />;
      case 'profile':
        return <ProfilePage onPageChange={handlePageChange} />;
      case 'settings':
        return <SettingsPage onPageChange={handlePageChange} />;
      case 'admin':
        return <AdminPage onPageChange={handlePageChange} />;
      case 'budgets':
        return <MyBudgetsPage onPageChange={handlePageChange} />;
      case 'favorites':
        return <FavoritesPage onPageChange={handlePageChange} />;
      case 'budget-settings':
        return <BudgetSettingsPage onPageChange={handlePageChange} />;
      case 'reports':
        return <ReportsPage onPageChange={handlePageChange} />;
      default:
        return <DashboardPage onPageChange={handlePageChange} />;
    }
  };

  return (
    <AuthProvider>
      <BudgetProvider>
        <CompanyProvider>
          <BudgetSettingsProvider>
        <div className="min-h-screen bg-secondary-50">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          {isAuthenticated ? (
            <div className="h-screen flex">
              {/* Sidebar */}
              <div ref={sidebarRef}>
                <Sidebar
                  isOpen={isMenuOpen}
                  onClose={() => setIsMenuOpen(false)}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  onLogout={handleLogout}
                />
              </div>
              
              {/* Main Content */}
              <div className="flex flex-col h-full flex-1">
                <Header
                  isMenuOpen={isMenuOpen}
                  onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
                  onNewBudget={() => handlePageChange('new-budget')}
                />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary-50">
                  <div className="w-full px-4 py-6">
                    {renderPage()}
                  </div>
                </main>
              </div>
            </div>
          ) : (
            renderPage()
          )}
        </div>
          </BudgetSettingsProvider>
        </CompanyProvider>
      </BudgetProvider>
    </AuthProvider>
  );
}

export default App;
