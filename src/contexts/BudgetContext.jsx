import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { loadFavorites, saveFavorites } from '../utils/storage';

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

  const toUIBudget = (row) => ({
    id: row.id,
    info: {
      nomeProjeto: row.project_name || '',
      nomeCliente: row.client_name || '',
      pais: row.project_country || '',
      estado: row.project_state || '',
      cidade: row.project_city || '',
      tipoObra: row.project_type || ''
    },
    structure: {
      type: row.structure_type || null,
      etapas: row.steps || [],
      comodos: row.rooms || []
    },
    materials: row.materials || [],
    labor: row.labor || [],
    quantidades: row.materials_quantities || {},
    total: row.total_cost || 0,
    budgetType: row.budget_type || null,
    budgetMode: row.budget_mode || null,
    status: row.status || 'Ativo',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id
  });

  const toRow = (data) => ({
    project_name: data?.info?.nomeProjeto ?? null,
    client_name: data?.info?.nomeCliente ?? null,
    project_country: data?.info?.pais ?? null,
    project_state: data?.info?.estado ?? null,
    project_city: data?.info?.cidade ?? null,
    project_type: data?.info?.tipoObra ?? null,
    structure_type: data?.structure?.type ?? null,
    steps: data?.structure?.etapas ?? [],
    rooms: data?.structure?.comodos ?? [],
    materials: data?.materials ?? [],
    labor: data?.labor ?? [],
    materials_quantities: data?.quantidades ?? {},
    total_cost: data?.total ?? 0,
    budget_type: data?.budgetType ?? null,
    budget_mode: data?.budgetMode ?? null,
    status: data?.status ?? 'Ativo',
    user_id: data?.userId ?? null
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        const uid = userData?.user?.id;
        if (!uid) {
          setBudgets([]);
        } else {
          const { data, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('user_id', uid)
            .order('created_at', { ascending: false });
          if (error) throw error;
          setBudgets((data || []).map(toUIBudget));
        }
        const savedFavorites = loadFavorites();
        setFavoriteMaterials(savedFavorites);
      } catch (error) {
        console.error('Erro ao carregar orçamentos do Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, _session) => {
      loadData();
    });
    return () => {
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    saveFavorites(favoriteMaterials);
  }, [favoriteMaterials]);

  const createBudget = async (budgetData) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      const row = toRow({ ...budgetData, userId: budgetData.userId || uid });
      const { data, error } = await supabase
        .from('budgets')
        .insert(row)
        .select('*')
        .single();
      if (error) throw error;
      const newBudget = toUIBudget(data);
      setBudgets(prev => [newBudget, ...prev]);
      return { success: true, budget: newBudget };
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
      return { success: false, error: error.message };
    }
  };

  const updateBudget = async (budgetId, updatedData) => {
    try {
      const patch = toRow(updatedData);
      delete patch.user_id;
      const { data, error } = await supabase
        .from('budgets')
        .update(patch)
        .eq('id', budgetId)
        .select('*')
        .single();
      if (error) throw error;
      const updated = toUIBudget(data);
      setBudgets(prev => prev.map(b => (b.id === budgetId ? updated : b)));
      return { success: true, budget: updated };
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteBudget = async (budgetId) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId);
      if (error) throw error;
      setBudgets(prev => prev.filter(b => b.id !== budgetId));
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
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

