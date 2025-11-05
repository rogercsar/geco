import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateId } from '../utils/format';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany deve ser usado dentro de um CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadData = () => {
      try {
        const savedCompanies = localStorage.getItem('geco_companies');
        if (savedCompanies) {
          setCompanies(JSON.parse(savedCompanies));
        } else {
          // Dados de exemplo
          const exampleCompanies = [
            {
              id: generateId(),
              nome: 'Construtora ABC Ltda',
              cnpj: '12.345.678/0001-90',
              email: 'contato@construtoraabc.com',
              telefone: '(11) 99999-9999',
              endereco: {
                rua: 'Rua das Construções, 123',
                cidade: 'São Paulo',
                estado: 'SP',
                cep: '01234-567'
              },
              responsavel: 'João Silva',
              categoria: 'Construtora',
              status: 'ativo',
              produtos: [
                {
                  id: generateId(),
                  nome: 'Cimento CP-II-Z-32',
                  descricao: 'Cimento Portland composto com pozolana',
                  categoria: 'Materiais Básicos',
                  unidade: 'saco',
                  preco: 25.50,
                  estoque: 1000,
                  fornecedor: 'Votorantim Cimentos'
                },
                {
                  id: generateId(),
                  nome: 'Tijolo Cerâmico 9x19x19',
                  descricao: 'Tijolo cerâmico comum para alvenaria',
                  categoria: 'Materiais Básicos',
                  unidade: 'milheiro',
                  preco: 450.00,
                  estoque: 500,
                  fornecedor: 'Cerâmica São José'
                }
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: generateId(),
              nome: 'Materiais de Construção XYZ',
              cnpj: '98.765.432/0001-10',
              email: 'vendas@materiaisxyz.com',
              telefone: '(11) 88888-8888',
              endereco: {
                rua: 'Av. dos Materiais, 456',
                cidade: 'São Paulo',
                estado: 'SP',
                cep: '04567-890'
              },
              responsavel: 'Maria Santos',
              categoria: 'Distribuidora',
              status: 'ativo',
              produtos: [
                {
                  id: generateId(),
                  nome: 'Areia Média',
                  descricao: 'Areia média para construção civil',
                  categoria: 'Materiais Básicos',
                  unidade: 'm³',
                  preco: 85.00,
                  estoque: 200,
                  fornecedor: 'Pedreira Central'
                },
                {
                  id: generateId(),
                  nome: 'Brita 1',
                  descricao: 'Brita número 1 para concreto',
                  categoria: 'Materiais Básicos',
                  unidade: 'm³',
                  preco: 95.00,
                  estoque: 150,
                  fornecedor: 'Pedreira Central'
                }
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
          setCompanies(exampleCompanies);
          localStorage.setItem('geco_companies', JSON.stringify(exampleCompanies));
        }
      } catch (error) {
        console.error('Erro ao carregar dados de empresas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Salvar empresas quando mudar
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem('geco_companies', JSON.stringify(companies));
    }
  }, [companies]);

  const addCompany = (companyData) => {
    try {
      const newCompany = {
        id: generateId(),
        ...companyData,
        produtos: companyData.produtos || [],
        status: 'ativo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedCompanies = [...companies, newCompany];
      setCompanies(updatedCompanies);
      
      return { success: true, company: newCompany };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateCompany = (companyId, updatedData) => {
    try {
      const updatedCompanies = companies.map(company => 
        company.id === companyId 
          ? { ...company, ...updatedData, updatedAt: new Date().toISOString() }
          : company
      );
      
      setCompanies(updatedCompanies);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteCompany = (companyId) => {
    try {
      const updatedCompanies = companies.filter(company => company.id !== companyId);
      setCompanies(updatedCompanies);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addProduct = (companyId, productData) => {
    try {
      const updatedCompanies = companies.map(company => {
        if (company.id === companyId) {
          const newProduct = {
            id: generateId(),
            ...productData
          };
          return {
            ...company,
            produtos: [...company.produtos, newProduct],
            updatedAt: new Date().toISOString()
          };
        }
        return company;
      });
      
      setCompanies(updatedCompanies);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProduct = (companyId, productId, updatedData) => {
    try {
      const updatedCompanies = companies.map(company => {
        if (company.id === companyId) {
          return {
            ...company,
            produtos: company.produtos.map(product =>
              product.id === productId
                ? { ...product, ...updatedData }
                : product
            ),
            updatedAt: new Date().toISOString()
          };
        }
        return company;
      });
      
      setCompanies(updatedCompanies);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = (companyId, productId) => {
    try {
      const updatedCompanies = companies.map(company => {
        if (company.id === companyId) {
          return {
            ...company,
            produtos: company.produtos.filter(product => product.id !== productId),
            updatedAt: new Date().toISOString()
          };
        }
        return company;
      });
      
      setCompanies(updatedCompanies);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getCompanyById = (companyId) => {
    return companies.find(company => company.id === companyId);
  };

  const getProductById = (companyId, productId) => {
    const company = getCompanyById(companyId);
    return company?.produtos.find(product => product.id === productId);
  };

  const value = {
    companies,
    loading,
    addCompany,
    updateCompany,
    deleteCompany,
    addProduct,
    updateProduct,
    deleteProduct,
    getCompanyById,
    getProductById
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};
