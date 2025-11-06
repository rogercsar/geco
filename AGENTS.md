# AGENTS.md

## Instruções para Agentes de IA

Olá! Sou o Geco, uma plataforma de orçamentos para construção civil. Aqui estão algumas diretrizes para trabalhar no meu código.

### 1. Visão Geral da Stack

- **Frontend:** React, Vite, Redux Toolkit, React Router, Tailwind CSS.
- **Backend:** Node.js, Express, Mongoose.
- **Testes:** Vitest, React Testing Library.

O código do frontend está em `/src` e o do backend em `/server`.

### 2. Como Rodar o Ambiente de Desenvolvimento

Para trabalhar no projeto, você precisa rodar o servidor de backend e o de frontend simultaneamente.

1.  **Backend:**
    ```bash
    cd server
    npm install
    npm run dev
    ```
2.  **Frontend:**
    ```bash
    npm install
    npm run dev
    ```

### 3. Padrões de Código

- **Estado Global:** Utilize o Redux Toolkit para gerenciar o estado global. Crie novos `slices` em `src/features` para novas funcionalidades.
- **Roteamento:** Utilize o `react-router-dom` para navegação. Adicione novas rotas em `src/App.jsx`.
- **Componentes:** Crie componentes reutilizáveis em `src/components/ui`.
- **Estilo:** Utilize as classes do Tailwind CSS e siga o design system definido em `tailwind.config.js`.

### 4. Testes

- **Obrigatório:** Para cada nova funcionalidade ou correção de bug, adicione testes correspondentes.
- **Localização:** Os arquivos de teste devem estar localizados próximos aos arquivos que estão testando (ex: `Button.test.jsx` ao lado de `Button.jsx`).
- **Comando:** Rode `npm test` para executar a suíte de testes.

### 5. Backend

- **Estrutura:** Siga o padrão Model-View-Controller (MVC) implementado em `server/`.
  - `models/`: Schemas do Mongoose.
  - `routes/`: Definições de rotas do Express.
  - `controllers/`: Lógica de negócio das rotas.
- **API:** A API está versionada sob `/api/v1/`.

### 6. Verificação do Trabalho

Após qualquer modificação, sempre verifique se:
1.  O projeto compila sem erros (`npm run build`).
2.  Todos os testes passam (`npm test`).
3.  A aplicação funciona como esperado no navegador.
