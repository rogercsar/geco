import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import NewBudgetPage from './pages/budget/NewBudgetPage';
import BudgetDetailsPage from './pages/budget/BudgetDetailsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import FavoritesPage from './pages/FavoritesPage';
import BudgetSettingsPage from './pages/admin/BudgetSettingsPage';
import ReportsPage from './pages/ReportsPage';
import MyBudgetsPage from './pages/MyBudgetsPage';
import Layout from './components/layout/Layout';
import { useEffect } from 'react';
import { initAuth } from './features/authSlice';
import PaymentCallbackPage from './pages/payment/PaymentCallback.jsx';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-secondary-50">
        <Toaster position="top-right" />
        {loading ? (
          <div className="p-8 text-center text-secondary-700">Carregando...</div>
        ) : (
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/" />} />
+           <Route path="/payment/callback" element={<PaymentCallbackPage />} />
            
            <Route
              path="/*"
              element={
                isAuthenticated ? (
                  <Layout>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/new-budget" element={<NewBudgetPage />} />
                      <Route path="/budgets" element={<MyBudgetsPage />} />
                      <Route path="/budgets/:id" element={<BudgetDetailsPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/admin" element={<AdminPage />} />
                      <Route path="/admin/budget-settings" element={<BudgetSettingsPage />} />
                    </Routes>
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
