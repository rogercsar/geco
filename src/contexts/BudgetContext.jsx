import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadBudgets, saveBudgets, loadFavorites, saveFavorites } from '../utils/storage';
import { generateId } from '../utils/format';

const BudgetContext = createContext();

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget deve ser usado dentro de um BudgetProvider');
  }
  return context;
};

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [favoriteMaterials, setFavoriteMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadData = () => {
      try {
        const savedBudgets = loadBudgets();
        const savedFavorites = loadFavorites();
        
        setBudgets(savedBudgets);
        setFavoriteMaterials(savedFavorites);
      } catch (error) {
        console.error('Erro ao carregar dados de orçamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Salvar orçamentos quando mudar
  useEffect(() => {
    if (budgets.length >= 0) {
      saveBudgets(budgets);
    }
  }, [budgets]);

  // Salvar favoritos quando mudar
  useEffect(() => {
    saveFavorites(favoriteMaterials);
  }, [favoriteMaterials]);

  const createBudget = (budgetData) => {
    try {
      const newBudget = {
        id: generateId(),
        ...budgetData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setBudgets(prev => [newBudget, ...prev]);
      return { success: true, budget: newBudget };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateBudget = (budgetId, updatedData) => {
    try {
      const updatedBudgets = budgets.map(budget =>
        budget.id === budgetId
          ? { ...budget, ...updatedData, updatedAt: new Date().toISOString() }
          : budget
      );

      setBudgets(updatedBudgets);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteBudget = (budgetId) => {
    try {
      const updatedBudgets = budgets.filter(budget => budget.id !== budgetId);
      setBudgets(updatedBudgets);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getBudgetsByUser = (userId) => {
    return budgets.filter(budget => budget.userId === userId);
  };

  const getBudgetById = (budgetId) => {
    return budgets.find(budget => budget.id === budgetId);
  };

  const toggleFavoriteMaterial = (materialId) => {
    setFavoriteMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const isMaterialFavorite = (materialId) => {
    return favoriteMaterials.includes(materialId);
  };

  const getFavoriteMaterials = () => {
    return favoriteMaterials;
  };

  const clearFavorites = () => {
    setFavoriteMaterials([]);
  };

  const value = {
    budgets,
    favoriteMaterials,
    loading,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetsByUser,
    getBudgetById,
    toggleFavoriteMaterial,
    isMaterialFavorite,
    getFavoriteMaterials,
    clearFavorites
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

