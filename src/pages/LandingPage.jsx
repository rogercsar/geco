import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, HelpCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const features = [
  { title: 'Simulação por cômodo', desc: 'Escolha opções pré-definidas e veja custo médio de materiais.' },
  { title: 'Orçamentos rápidos', desc: 'Crie orçamentos em minutos com etapas guiadas.' },
  { title: 'Materiais e mão de obra', desc: 'Controle detalhado de itens, quantidades e custos.' },
  { title: 'Relatórios e exportação', desc: 'Analise e compartilhe PDFs com seus clientes.' },
];

const plans = [
  { name: 'Básico', price: 'Grátis', perks: ['Até 3 orçamentos', 'Simulação de cômodos (visualização)', 'Download lista por R$ 5'] },
  { name: 'Pro', price: 'R$ 29/mês', perks: ['Orçamentos ilimitados', 'Simulação de cômodos avançada', 'Exportação PDF', 'Suporte prioritário'] },
  { name: 'Empresarial', price: 'Sob consulta', perks: ['Equipe e permissões', 'Relatórios avançados', 'SLA', 'Consultoria de projetos'] },
];

const faqs = [
  { q: 'Posso usar sem pagar?', a: 'Sim, o plano Básico é gratuito com limite de orçamentos.' },
  { q: 'Exporta PDF?', a: 'Sim, disponível nos planos Pro e Empresarial.' },
  { q: 'Como funciona o upgrade?', a: 'Via pagamento integrado; seu plano muda automaticamente.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">G</span>
          </div>
          <span className="font-bold text-secondary-900">Geco</span>
        </Link>
        <div className="space-x-2">
          <Link to="/login"><Button variant="outline">Entrar</Button></Link>
          <Link to="/register"><Button>Cadastrar</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-secondary-900">
          Orçamentos de obras, simples e poderosos
        </h1>
        <p className="mt-4 text-secondary-600 max-w-2xl mx-auto">
          Crie, gerencie e compartilhe orçamentos com rapidez. Simule cômodos com opções pré-definidas e veja custos médios de materiais.
        </p>
        <div className="mt-6 space-x-3">
          <Link to="/simulation"><Button size="lg">Simular cômodo</Button></Link>
          <Link to="/login"><Button size="lg" variant="outline">Já tenho conta</Button></Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader><CardTitle>{f.title}</CardTitle></CardHeader>
            <CardContent><p className="text-secondary-600">{f.desc}</p></CardContent>
          </Card>
        ))}
      </section>

      {/* Por que usar */}
      <section className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader><CardTitle>Por que usar o Geco?</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-secondary-700">
            <p>Simplifique a criação de orçamentos, mantenha materiais e mão de obra organizados e feche mais negócios.</p>
            <p>Integrações de pagamento para upgrade de plano e relatórios para acompanhar resultados.</p>
          </CardContent>
        </Card>
      </section>

      {/* Depoimentos */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">O que dizem nossos clientes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center space-x-2 text-primary-600 mb-2"><Star /><Star /><Star /><Star /><Star /></div>
              <p className="text-secondary-700">“Plataforma rápida, intuitiva e que me ajudou a ganhar tempo e credibilidade.”</p>
              <span className="mt-2 text-sm text-secondary-500">— Profissional da construção</span>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">FAQ</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {faqs.map((f) => (
            <Card key={f.q} className="p-4">
              <div className="flex items-center space-x-2 font-semibold text-secondary-900 mb-2">
                <HelpCircle className="h-4 w-4" /> <span>{f.q}</span>
              </div>
              <p className="text-secondary-700">{f.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Planos</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card key={p.name} className="p-6">
              <h3 className="text-xl font-bold text-secondary-900">{p.name}</h3>
              <p className="text-primary-600 text-lg mt-1">{p.price}</p>
              <ul className="mt-4 space-y-2">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center space-x-2 text-secondary-700">
                    <Check className="h-4 w-4 text-primary-600" /> <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link to={p.name === 'Básico' ? '/register' : '/login'}>
                  <Button className="w-full">Assinar</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-secondary-600">
        © {new Date().getFullYear()} Geco. Todos os direitos reservados.
      </footer>
    </div>
  );
}