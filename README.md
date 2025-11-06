# Geco - Plataforma de Orçamentos de Construção Civil

Uma plataforma moderna e intuitiva para cadastrar e gerenciar orçamentos de construção civil, desenvolvida com React, Node.js e Tailwind CSS.

## 🚀 Status do Projeto

Este projeto foi significativamente refatorado para melhorar sua robustez, escalabilidade e manutenibilidade. As principais melhorias incluem a implementação de um backend dedicado, um sistema de gerenciamento de estado centralizado, roteamento profissional e uma suíte de testes automatizados.

## ✅ Funcionalidades

- **Backend com API RESTful**: Servidor Node.js/Express com banco de dados MongoDB para persistência de dados.
- **Sistema de Autenticação**: Endpoints para registro e login de usuários com senhas criptografadas.
- **Gerenciamento de Orçamentos**: API para CRUD (Create, Read, Update, Delete) de orçamentos.
- **Gestão de Estado com Redux**: Gerenciamento centralizado do estado da aplicação com Redux Toolkit.
- **Roteamento com React Router**: Navegação robusta e baseada em URL com `react-router-dom`.
- **Exportação para PDF**: Funcionalidade inicial para exportar detalhes do orçamento para PDF.
- **Testes Automatizados**: Ambiente de testes configurado com Vitest e React Testing Library.
- **Interface Responsiva**: Design moderno e mobile-first com Tailwind CSS.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- **React 18**
- **Vite**
- **Tailwind CSS**
- **Redux Toolkit**
- **React Router DOM**
- **Vitest & React Testing Library**
- **Axios, Framer Motion, Lucide React**

**Backend:**
- **Node.js**
- **Express**
- **MongoDB & Mongoose**
- **bcryptjs, cors, dotenv**

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js (v18 ou superior)
- npm
- MongoDB (rodando localmente ou uma instância na nuvem)

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd geco
```

### 2. Instale as dependências do Frontend
```bash
npm install
```

### 3. Instale as dependências do Backend
```bash
cd server
npm install
```

### 4. Configure as Variáveis de Ambiente
- No diretório `server/`, crie um arquivo `.env`.
- Adicione a sua string de conexão do MongoDB:
  ```
  MONGO_URI=mongodb://localhost:27017/geco
  ```

### 5. Execute o projeto
- **Terminal 1 (Backend):**
  ```bash
  cd server
  npm run dev
  # O servidor backend irá rodar em http://localhost:5000
  ```
- **Terminal 2 (Frontend):**
  ```bash
  # A partir da raiz do projeto
  npm run dev
  # A aplicação estará disponível em http://localhost:5173
  ```

### 👤 Credenciais de Teste
- **Usuário Administrador (Padrão no `AuthContext` antigo, precisa ser recriado no DB):**
  - **Email**: `admin@geco.app`
  - **Senha**: `admin123`
- Para novos usuários, utilize a funcionalidade de registro.

## 🏗️ Estrutura do Projeto
```
geco/
├── server/              # Código do Backend (Node.js/Express)
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
├── src/                 # Código do Frontend (React)
│   ├── components/
│   ├── features/        # Slices do Redux
│   ├── pages/
│   ├── store/           # Store do Redux
│   └── ...
├── tests/               # Configuração dos testes
└── ...
```

## 🔧 Scripts Disponíveis
- `npm run dev` - Inicia o servidor de desenvolvimento do frontend.
- `npm run build` - Gera o build de produção do frontend.
- `npm run test` - Executa os testes automatizados.
- `cd server && npm run dev` - Inicia o servidor de desenvolvimento do backend.

## 📄 Licença
Este projeto está sob a licença MIT.

## 🔌 Configuração de API (Produção)
- Em produção (Netlify), configure `VITE_API_BASE_URL` nas variáveis de ambiente do site apontando para seu backend (Ex.: `https://seu-backend.exemplo.com`).
- O frontend irá chamar `VITE_API_BASE_URL + /api/v1/...` evitando 404 no domínio da Netlify.
- Localmente, o proxy do Vite já encaminha `/api` para `http://localhost:5000` conforme `vite.config.js`.

### Passos no Netlify
- Site settings → Build & deploy → Environment → Add variable
- Key: `VITE_API_BASE_URL` | Value: `https://seu-backend.exemplo.com`
- Redeploy o site para aplicar a variável.

### Deploy do Backend
- Você pode publicar `server/` em um provedor como Render/Railway.
- Configure `MONGO_URI` e use Node 20 LTS.
- Um arquivo `render.yaml` opcional pode facilitar a criação do serviço.


## 🔗 Integração com Supabase (Budgets)
- O módulo de orçamentos foi migrado para Supabase usando `@supabase/supabase-js`.
- Configure as variáveis de ambiente no frontend:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- A tabela e políticas RLS estão em `supabase/budgets.sql`. Aplique no SQL Editor do Supabase:
  - Cria a tabela `public.budgets` com colunas em `snake_case`.
  - Habilita RLS e políticas de leitura/escrita restritas ao usuário (`auth.uid()`).
  - Trigger para atualizar `updated_at` em updates.

### Mapeamento de Dados (UI ↔ DB)
- O `BudgetContext.jsx` faz a conversão automática entre os formatos:
  - DB (`snake_case`): `project_name`, `client_name`, `materials`, `labor`, `materials_quantities`, `budget_type`, etc.
  - UI (`camelCase`): `info.nomeProjeto`, `info.nomeCliente`, `materials`, `labor`, `quantidades`, `budgetType`, etc.
- Funções principais:
  - `createBudget(data)`: `insert` com `user_id = auth.uid()` (RLS).
  - `updateBudget(id, data)`: `update` seguro (não altera `user_id`).
  - `deleteBudget(id)`: remoção do próprio usuário.
  - `duplicateBudget(id)`: insere uma cópia do orçamento, respeitando o limite de plano.

### Fluxo na UI
- Listagem: `MyBudgetsPage` consome `getBudgetsByUser(userId)` do contexto.
- Criação/Edição: `NewBudgetPage` envia `budgetType` e demais campos; CRUD pelo contexto.
- Duplicação: botão "Duplicar" usa `duplicateBudget`. Aplica `canCreateNewBudget` para limites.
- Exclusão: botão "Excluir" usa `deleteBudget` e atualiza a lista local.

### Observações
- Certifique-se de que o usuário esteja autenticado; RLS bloqueia acesso sem `auth.uid()`.
- Caso altere o schema, mantenha o mapeamento em `toUIBudget`/`toRow` no `BudgetContext.jsx`.

