# Kitchen_Guardian

# 🍽️ Guardião da Cozinha

> Sistema de gerenciamento de estoque para cozinhas domésticas e institucionais.

---

## 📋 Sumário

- [Contexto do Problema e Solução](#-contexto-do-problema-e-solução)
- [Instruções para Uso](#-instruções-para-uso)
- [Instruções para Devs](#-instruções-para-devs)
- [Testes Unitários](#-testes-unitários)
- [Tecnologias](#-tecnologias)
- [Organização do Projeto](#-organização-do-projeto)
- [Equipe](#-equipe)

---

## 🧩 Contexto do Problema e Solução

### Problema

Ambientes domésticos e institucionais frequentemente enfrentam dificuldades no controle do estoque de alimentos. A falta de organização gera desperdício de produtos, dificuldade em acompanhar datas de validade e ausência de visibilidade sobre o consumo real ao longo do tempo. Sem uma ferramenta adequada, gestores e usuários da cozinha tomam decisões com base em informações imprecisas ou desatualizadas, resultando em reposições desnecessárias, perdas por vencimento e descontrole financeiro.

### Solução

O **Guardião da Cozinha** é um sistema web de gestão de estoque focado em cozinhas. Ele permite:

- **Cadastro e atualização de produtos** com nome, categoria, quantidade e data de validade.
- **Registro de entradas e saídas** de produtos, com rastreabilidade por usuário responsável.
- **Alertas e indicadores** sobre produtos com baixo estoque ou próximos do vencimento.
- **Geração de relatórios** consolidados sobre o estado do estoque e movimentações por período e usuário.
- **Controle de acesso** por perfis (Administrador, Operador e Gestor), garantindo segurança e rastreabilidade das operações.

---

## 🚀 Instruções para Uso

> Estas instruções são destinadas a qualquer pessoa que deseje **utilizar** o sistema, sem necessidade de conhecimento técnico aprofundado.

### Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js v18+](https://nodejs.org/) — necessário para rodar o servidor e o frontend
- [PostgreSQL 15+](https://www.postgresql.org/download/) — banco de dados da aplicação
- Navegador moderno (Chrome, Firefox ou Edge)

### Passo a passo

**1. Baixe o sistema**

Acesse a página de releases do repositório e baixe o arquivo de instalação mais recente:

```
[https://github.com/RATZogun/Kitchen_Guardian/releases]
```

Ou clone diretamente pelo terminal:

```bash
git clone [https://github.com/RATZogun/Kitchen_Guardian.git]
cd Kitchen_Guardian
```

**2. Configure o banco de dados**

Com o PostgreSQL instalado e rodando, crie o banco de dados da aplicação:
 
```bash
# Acesse o terminal do PostgreSQL
psql -U postgres
 
# Dentro do psql, crie o banco:
CREATE DATABASE guardiao_da_cozinha;
\q
```
 
Em seguida, execute o script de criação das tabelas:
 
```bash
cd backend
psql -U postgres -d guardiao_da_cozinha -f src/database/schema.sql
```

**3. Defina as variáveis de ambiente**
 
Copie o arquivo de exemplo e preencha com as suas configurações:
 
```bash
cd backend
cp .env.example .env
```
 
Edite o arquivo `.env` com seus dados do PostgreSQL:
 
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=guardiao_da_cozinha
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
PORT=3001
JWT_SECRET=um_segredo_qualquer_aqui
```

**4. Inicie a aplicação**

Abra **dois terminais** e execute em cada um:
 
_Terminal 1 — Backend (API Node.js):_
```bash
cd backend
npm install
npm start
```
 
_Terminal 2 — Frontend (React):_
```bash
cd frontend
npm install
npm start
```

**5. Acesse no navegador**

Abra seu navegador e acesse:

```
http://localhost:3000
```

**6. Primeiro acesso**

- Utilize as credenciais de administrador padrão para o primeiro acesso:
  - **Usuário:** `[TODO: ex.: admin@guardiao.com]`
  - **Senha:** `[TODO: ex.: admin123]`
- ⚠️ Altere a senha imediatamente após o primeiro login.

---

## 💻 Instruções para Devs

> Estas instruções são destinadas a quem deseja **contribuir ou executar o ambiente de desenvolvimento** localmente.

### Pré-requisitos

- Node.js v18+
- PostgreSQL 15+ rodando localmente
- Banco de dados `guardiao_da_cozinha` criado (veja o Passo 2 em [Instruções para Uso](#-instruções-para-uso))
- Arquivo `sistema/backend/.env` configurado (veja o Passo 3)

### Rodar o backend em modo desenvolvimento

```bash
cd sistema/backend
npm install
npm run dev        # reinicia automaticamente ao salvar arquivos (nodemon)
```

### Rodar o frontend em modo desenvolvimento

```bash
cd sistema/frontend
npm install
npm run dev        # servidor Vite em http://localhost:3000
```

---

## 🧪 Testes Unitários

Os testes unitários cobrem as regras de negócio das quatro camadas de serviço do backend usando **Jest**.

### Arquivos de teste

```
sistema/backend/tests/
├── categoriaService.test.js
├── fornecedorService.test.js
├── movimentacaoService.test.js
└── produtoService.test.js
```

### Executar todos os testes

```bash
cd sistema/backend
npm test
```

Saída esperada:

```
PASS tests/categoriaService.test.js
PASS tests/fornecedorService.test.js
PASS tests/movimentacaoService.test.js
PASS tests/produtoService.test.js

Test Suites: 4 passed, 4 total
Tests:       XX passed, XX total
```

### Executar com relatório de cobertura

```bash
cd sistema/backend
npm run test:coverage
```

O relatório é exibido no terminal e também salvo em `sistema/backend/coverage/`. Os limiares mínimos exigidos pelo projeto são:

| Métrica    | Mínimo |
|------------|--------|
| Linhas     | 80 %   |
| Funções    | 80 %   |
| Statements | 80 %   |
| Branches   | 70 %   |

> Se qualquer limiar não for atingido, o comando retorna código de saída `1` (falha).

---

## 💻 Tecnologias
 
| Camada         | Tecnologia                                   |
|----------------|----------------------------------------------|
| Frontend       | [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/) |
| Backend        | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) |
| Banco de Dados | [PostgreSQL 15+](https://www.postgresql.org/) |
| Autenticação   | JWT (JSON Web Tokens)                        |
| Gerenciador de pacotes | npm                                |
| Testes         | Jest                                         |
 
---

## 📁 Organização do Projeto
 
```
guardiao-da-cozinha/
│
├── backend/                         # API Node.js + Express
│   ├── src/
│   │   ├── controllers/             # Controladores das rotas (Produto, Movimentação, Relatório)
│   │   ├── services/                # Regras de negócio
│   │   ├── repositories/           # Acesso ao banco de dados (queries PostgreSQL)
│   │   ├── routes/                  # Definição das rotas da API REST
│   │   ├── middlewares/             # Autenticação JWT e tratamento de erros
│   │   ├── database/
│   │   │   └── schema.sql           # Script de criação das tabelas no PostgreSQL
│   │   └── utils/                   # Funções auxiliares
│   ├── tests/                       # Testes automatizados (Jest)
│   ├── .env.example                 # Modelo de variáveis de ambiente
│   └── package.json
│
├── frontend/                        # Interface React + Tailwind CSS
│   ├── src/
│   │   ├── components/              # Componentes reutilizáveis da UI
│   │   ├── pages/                   # Páginas da aplicação (Login, Produtos, Movimentações, Relatórios)
│   │   ├── services/                # Chamadas à API do backend (fetch/axios)
│   │   ├── contexts/                # Contextos React (autenticação, usuário)
│   │   └── assets/                  # Imagens e ícones
│   └── package.json
│
├── requisitos/                      # Documentação do projeto
│   └── Documento_de_Requisitos.pdf
│
├── Padrões Adotados/                # Padrões do projeto
│   └── Regras de Verificação e Analise de Requisitos.md
│
└── README.md                        # Este arquivo
```
 
---
 
## 👥 Equipe

| Nome | Função |
|------|--------|
| Gilson dos Santos Júnior | Desenvolvimento |
| Izac Moreira Souza Junior    | Desenvolvimento |

---

> Documento de Requisitos versão 1.0 — Lavras, Junho de 2026.