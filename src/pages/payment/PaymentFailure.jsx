import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

export default function PaymentFailurePage() {
  const [params] = useSearchParams();
  const origin = params.get('origin') || 'simulation';
  const reason = params.get('reason') || null;
  return (
    <div className="min-h-screen bg-secondary-50">
      <Sidebar />
      <main className="lg:ml-64 container mx-auto px-4 pt-6 pb-10">
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-secondary-900 mb-3">Pagamento não concluído</h1>
          <p className="text-secondary-700 mb-4">O pagamento não foi finalizado. Você pode tentar novamente.</p>
          {reason && <p className="text-secondary-600 mb-4">Detalhe: <span className="font-mono">{reason}</span></p>}
          <div className="flex gap-3">
            {origin === 'simulation' ? (
              <Link to="/simulation" className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition">Voltar à Simulação</Link>
            ) : (
              <Link to="/dashboard" className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition">Ir para o Dashboard</Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}