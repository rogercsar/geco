# Geco - Plataforma de Orçamentos de Construção Civil

Uma plataforma moderna e intuitiva para cadastrar e gerenciar orçamentos de construção civil, desenvolvida com React e Tailwind CSS.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Sistema de Autenticação**: Login e cadastro de usuários
- **Dashboard Interativo**: Visão geral dos orçamentos e estatísticas
- **Criação de Orçamentos**: Processo guiado em 5 etapas
- **Sistema de Planos**: Básico, Pro e Empresarial
- **Interface Responsiva**: Design moderno e mobile-first
- **Persistência de Dados**: Armazenamento local com localStorage
- **Sistema de Favoritos**: Materiais favoritos por usuário

### 🔄 Em Desenvolvimento
- Seleção de materiais por etapa
- Cálculo automático de preços
- Exportação para PDF
- Envio por email/WhatsApp
- Painel administrativo completo
- Relatórios avançados

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd geco
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:5173
   ```

## 🎯 Como Usar

### Primeiro Acesso
1. Acesse a aplicação
2. Clique em "Cadastre-se aqui"
3. Preencha os dados e escolha um plano
4. Faça login com suas credenciais

### Criando um Orçamento
1. No dashboard, clique em "Novo Orçamento"
2. **Passo 1**: Preencha as informações do projeto
3. **Passo 2**: Escolha o tipo de estrutura
4. **Passo 3**: Selecione as etapas da obra
5. **Passo 4**: Configure os materiais (em desenvolvimento)
6. **Passo 5**: Revise e salve o orçamento

### Usuário Administrador
- **Email**: admin@geco.app
- **Senha**: admin123

## 📱 Planos Disponíveis

### Básico (Gratuito)
- Até 3 orçamentos
- Materiais básicos
- Cálculos automáticos
- Suporte por email

### Pro (R$ 29,90/mês)
- Orçamentos ilimitados
- Todos os materiais
- Lista de fornecedores
- Exportação PDF
- Favoritos
- Suporte prioritário

### Empresarial (R$ 99,90/mês)
- Todas as funcionalidades Pro
- Assinatura digital
- Envio por email/WhatsApp
- Relatórios avançados
- Suporte telefônico
- API personalizada

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface
│   └── layout/         # Componentes de layout
├── contexts/           # Contextos React
├── data/              # Dados e constantes
├── pages/             # Páginas da aplicação
│   ├── auth/          # Páginas de autenticação
│   └── budget/        # Páginas de orçamento
├── utils/             # Utilitários
└── App.jsx            # Componente principal
```

## 🎨 Design System

O projeto utiliza um design system consistente com:
- **Cores**: Paleta baseada em azul (primary) e cinza (secondary)
- **Tipografia**: Inter como fonte principal
- **Componentes**: Sistema modular e reutilizável
- **Animações**: Transições suaves com Framer Motion
- **Responsividade**: Mobile-first approach

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte ou dúvidas:
- Email: suporte@geco.app
- WhatsApp: (11) 99999-9999

---

Desenvolvido com ❤️ para a construção civil brasileira.

