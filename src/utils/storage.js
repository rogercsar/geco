// Utilitários para persistência de dados no localStorage

export const STORAGE_KEYS = {
  USERS: 'geco_users',
  BUDGETS: 'geco_budgets',
  FAVORITES: 'geco_favorites',
  CURRENT_USER: 'geco_current_user',
  COMPANIES: 'geco_companies'
};

// Função genérica para salvar dados
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
    return false;
  }
};

// Função genérica para carregar dados
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Erro ao carregar do localStorage:', error);
    return defaultValue;
  }
};

// Função para remover dados
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erro ao remover do localStorage:', error);
    return false;
  }
};

// Funções específicas para cada tipo de dado
export const saveUsers = (users) => saveToStorage(STORAGE_KEYS.USERS, users);
export const loadUsers = () => loadFromStorage(STORAGE_KEYS.USERS, []);

export const saveBudgets = (budgets) => saveToStorage(STORAGE_KEYS.BUDGETS, budgets);
export const loadBudgets = () => loadFromStorage(STORAGE_KEYS.BUDGETS, []);

export const saveFavorites = (favorites) => saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
export const loadFavorites = () => loadFromStorage(STORAGE_KEYS.FAVORITES, []);

export const saveCurrentUser = (user) => saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
export const loadCurrentUser = () => loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);

export const saveCompanies = (companies) => saveToStorage(STORAGE_KEYS.COMPANIES, companies);
export const loadCompanies = () => loadFromStorage(STORAGE_KEYS.COMPANIES, []);

// Função para limpar todos os dados
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
};

