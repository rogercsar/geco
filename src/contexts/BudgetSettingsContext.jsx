import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BudgetSettingsContext = createContext();

export const useBudgetSettings = () => {
  const context = useContext(BudgetSettingsContext);
  if (!context) {
    throw new Error('useBudgetSettings deve ser usado dentro de um BudgetSettingsProvider');
  }
  return context;
};

export const BudgetSettingsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    // Configurações de layout
    layout: {
      showLogo: true,
      showSignature: true,
      showCompanyInfo: true,
      showSupplierInfo: true,
      showDiscount: true,
      showDateTime: true,
      colorScheme: 'primary', // primary, secondary, custom
      customColors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#10B981'
      }
    },
    // Configurações de empresa
    company: {
      logo: null,
      signature: null,
      name: '',
      address: '',
      phone: '',
      email: '',
      website: ''
    },
    // Configurações de assinatura
    signature: {
      type: 'upload', // upload, text, none
      text: '',
      image: null
    }
  });

  // Carregar configurações do localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('geco_budget_settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do orçamento:', error);
      }
    };

    loadSettings();
  }, []);

  // Salvar configurações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('geco_budget_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações do orçamento:', error);
    }
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const updateLayout = (layoutSettings) => {
    setSettings(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        ...layoutSettings
      }
    }));
  };

  const updateCompany = (companySettings) => {
    setSettings(prev => ({
      ...prev,
      company: {
        ...prev.company,
        ...companySettings
      }
    }));
  };

  const updateSignature = (signatureSettings) => {
    setSettings(prev => ({
      ...prev,
      signature: {
        ...prev.signature,
        ...signatureSettings
      }
    }));
  };

  const uploadLogo = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateCompany({ logo: e.target.result });
        resolve(e.target.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadSignature = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateSignature({ image: e.target.result, type: 'upload' });
        resolve(e.target.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const resetSettings = () => {
    setSettings({
      layout: {
        showLogo: true,
        showSignature: true,
        showCompanyInfo: true,
        showSupplierInfo: true,
        showDiscount: true,
        showDateTime: true,
        colorScheme: 'primary',
        customColors: {
          primary: '#3B82F6',
          secondary: '#6B7280',
          accent: '#10B981'
        }
      },
      company: {
        logo: null,
        signature: null,
        name: '',
        address: '',
        phone: '',
        email: '',
        website: ''
      },
      signature: {
        type: 'upload',
        text: '',
        image: null
      }
    });
  };

  const isBusinessUser = currentUser?.plano === 'empresarial' || currentUser?.isAdmin;

  const value = {
    settings,
    updateSettings,
    updateLayout,
    updateCompany,
    updateSignature,
    uploadLogo,
    uploadSignature,
    resetSettings,
    isBusinessUser
  };

  return (
    <BudgetSettingsContext.Provider value={value}>
      {children}
    </BudgetSettingsContext.Provider>
  );
};
