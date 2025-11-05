import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadCurrentUser, saveCurrentUser, loadUsers, saveUsers } from '../utils/storage';
import { generateId } from '../utils/format';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadData = () => {
      try {
        const savedUsers = loadUsers();
        const savedCurrentUser = loadCurrentUser();
        
        // Se não há usuários salvos, criar usuário admin padrão
        if (savedUsers.length === 0) {
          const adminUser = {
            id: generateId(),
            nome: 'Administrador',
            email: 'admin@geco.app',
            password: 'admin123',
            telefone: '',
            profissao: 'Administrador',
            plano: 'empresarial',
            isAdmin: true,
            createdAt: new Date().toISOString()
          };
          
          const businessUser = {
            id: generateId(),
            nome: 'Usuário Empresarial',
            email: 'empresarial@geco.app',
            password: '123456',
            telefone: '(11) 99999-9999',
            profissao: 'Engenheiro',
            plano: 'empresarial',
            isAdmin: false,
            createdAt: new Date().toISOString()
          };
          
          const initialUsers = [adminUser, businessUser];
          setUsers(initialUsers);
          saveUsers(initialUsers);
        } else {
          setUsers(savedUsers);
        }
        
        setCurrentUser(savedCurrentUser);
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Salvar usuário atual quando mudar
  useEffect(() => {
    if (currentUser) {
      saveCurrentUser(currentUser);
    }
  }, [currentUser]);

  // Salvar usuários quando mudar
  useEffect(() => {
    if (users.length > 0) {
      saveUsers(users);
    }
  }, [users]);

  const login = async (email, password) => {
    try {
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }

      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Verificar se email já existe
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      const newUser = {
        id: generateId(),
        ...userData,
        isAdmin: false,
        createdAt: new Date().toISOString()
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
  };

  const updateUser = (updatedUserData) => {
    try {
      const updatedUsers = users.map(user => 
        user.id === currentUser.id 
          ? { ...user, ...updatedUserData }
          : user
      );
      
      setUsers(updatedUsers);
      setCurrentUser({ ...currentUser, ...updatedUserData });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteUser = (userId) => {
    try {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      
      // Se o usuário deletado é o atual, fazer logout
      if (currentUser && currentUser.id === userId) {
        logout();
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    users,
    loading,
    login,
    register,
    logout,
    updateUser,
    deleteUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
