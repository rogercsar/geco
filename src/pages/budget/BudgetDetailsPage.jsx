import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useParams } from 'react-router-dom'; // Supondo que estamos usando react-router-dom
import ExportPDFButton from '../../components/ui/ExportPDFButton';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const BudgetDetailsPage = () => {
  const { id } = useParams(); // Supondo que estamos usando react-router-dom
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await api.get(`/api/v1/budgets/${id}`);
        setBudget(response.data.data);
      } catch (error) {
        console.error('Error fetching budget:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!budget) {
    return <div>Orçamento não encontrado.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detalhes do Orçamento</h1>
        <ExportPDFButton budgetId={id} budgetData={budget} />
      </div>
      <div id={`budget-details-${id}`}>
        <Card>
          <CardHeader>
            <CardTitle>{budget.projectName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Cliente:</strong> {budget.clientName}</p>
            <p><strong>Endereço:</strong> {budget.projectAddress}</p>
            <p><strong>Tipo de Projeto:</strong> {budget.projectType}</p>
            {/* Adicionar mais detalhes do orçamento aqui */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetDetailsPage;
