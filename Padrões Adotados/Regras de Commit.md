# Regras de Codificação e Commit

**Projeto:** Guardião da Cozinha  
**Versão:** 1.0  
**Data:** Junho de 2026  
**Equipe:** Gilson dos Santos Júnior, Izac Moreira Souza Junior

---

## Sumário

1. [Objetivo](#1-objetivo)
2. [Regra 1 — Padrão de Notação de Commits (Gitmoji)](#2-regra-1--padrão-de-notação-de-commits-gitmoji)
3. [Regra 2 — Nomenclatura Expressiva (Clean Code)](#3-regra-2--nomenclatura-expressiva-clean-code)
4. [Regra 3 — Política de Comentários](#4-regra-3--política-de-comentários)
5. [Regra 4 — Responsabilidade Única (SOLID — S)](#5-regra-4--responsabilidade-única-solid--s)
6. [Regra 5 — Aberto para Extensão, Fechado para Modificação (SOLID — O)](#6-regra-5--aberto-para-extensão-fechado-para-modificação-solid--o)
7. [Regra 6 — Inversão de Dependência (SOLID — D)](#7-regra-6--inversão-de-dependência-solid--d)
8. [Regra 7 — Funções Pequenas e com Propósito Único (Clean Code)](#8-regra-7--funções-pequenas-e-com-propósito-único-clean-code)
9. [Regra 8 — Proibição de Hardcode e Uso de Variáveis de Ambiente](#9-regra-8--proibição-de-hardcode-e-uso-de-variáveis-de-ambiente)
10. [Checklist de Revisão de Código](#10-checklist-de-revisão-de-código)

---

## 1. Objetivo

Este documento define as **regras de codificação e versionamento** que devem ser seguidas por toda a equipe durante o desenvolvimento do projeto **Guardião da Cozinha**.

Seu propósito é garantir que o código seja legível, manutenível e consistente independentemente de qual membro da equipe o tenha escrito. As regras são baseadas nos princípios de **Clean Code** (Robert C. Martin), **SOLID**, e boas práticas de versionamento com Git.

> **Todo código submetido ao repositório deve estar em conformidade com as regras deste documento antes de ser integrado à branch principal.**

---

## 2. Regra 1 — Padrão de Notação de Commits (Gitmoji)

> **Todo commit deve ser prefixado com um emoji Gitmoji que identifica a natureza da alteração, seguido de uma mensagem curta e descritiva em português.**

### Formato obrigatório

```
:<gitmoji>: <mensagem no imperativo, em português>
```

### Emojis obrigatórios e seus usos

| Emoji | Código | Quando usar |
|-------|--------|-------------|
| 🎉 | `:tada:` | Início do projeto ou funcionalidade principal |
| ✨ | `:sparkles:` | Adição de nova funcionalidade |
| 🐛 | `:bug:` | Correção de bug |
| 📝 | `:memo:` | Criação ou atualização de documentação |
| ♻️ | `:recycle:` | Refatoração de código sem mudança de comportamento |
| 🔧 | `:wrench:` | Alteração de configuração ou arquivos de ambiente |
| ✅ | `:white_check_mark:` | Adição ou correção de testes |
| 🔒 | `:lock:` | Correção de problema de segurança |
| 🗃️ | `:card_file_box:` | Alteração em banco de dados (schema, migrations) |
| 🔀 | `:twisted_rightwards_arrows:` | Merge de branches |

### Regras complementares

- A mensagem deve ter **no máximo 72 caracteres**.
- Use o **modo imperativo**: "adiciona", "corrige", "remove" — não "adicionei" ou "adicionando".
- Nunca deixe commits com mensagens genéricas como `fix`, `wip`, `ajuste` ou `teste`.

**Exemplos corretos:**

```
:sparkles: adiciona endpoint de cadastro de produto
:bug: corrige cálculo de saldo na consulta de produtos
:memo: atualiza documento de requisitos com RF009
:wrench: adiciona variáveis de ambiente para conexão com banco
```

**Exemplos incorretos:**

```
ajuste
fix bug
atualizei o código
commit
```

---

## 3. Regra 2 — Nomenclatura Expressiva (Clean Code)

> **Nomes de variáveis, funções, classes e arquivos devem revelar a intenção. Se um nome precisa de comentário para ser entendido, ele deve ser renomeado.**

### Convenções por contexto

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Variáveis e funções (JS/Node) | `camelCase` | `calcularSaldo()`, `produtoAtivo` |
| Classes e componentes React | `PascalCase` | `ProdutoController`, `ListaProdutos` |
| Constantes e variáveis de ambiente | `UPPER_SNAKE_CASE` | `JWT_SECRET`, `DB_PORT` |
| Arquivos de rotas e serviços | `camelCase` | `produtoRoutes.js`, `categoriaService.js` |
| Tabelas e colunas do banco | `snake_case` | `estoque_minimo`, `criado_em` |

### Regras de nomenclatura

- **Variáveis booleanas** devem começar com `is`, `has` ou `pode`: `isAtivo`, `hasProdutos`, `podeExcluir`.
- **Funções** devem começar com um **verbo**: `buscarProduto()`, `validarEmail()`, `calcularSaldo()`.
- **Evite abreviações** que não sejam amplamente conhecidas: prefira `usuario` a `usr`, `quantidade` a `qtd`.
- **Evite nomes genéricos** como `data`, `info`, `temp`, `aux`, `obj` sem contexto.

**Exemplos corretos:**

```js
// Node.js / Backend
const produtosAtivos = await produtoRepository.findAllAtivos();
function calcularSaldoEstoque(entradas, saidas) { ... }
const isProdutoVencido = produto.dataValidade < new Date();

// React / Frontend
function ListaProdutos({ categoriaId }) { ... }
const [isCarregando, setIsCarregando] = useState(false);
```

**Exemplos incorretos:**

```js
const d = await repo.get();          // o que é "d"?
function proc(e, s) { ... }          // verbos e parâmetros sem sentido
const flag = produto.val < hoje;     // "flag" e "val" não revelam intenção
```

---

## 4. Regra 3 — Política de Comentários

> **Comente o PORQUÊ, nunca o QUÊ. Código bem escrito já explica o que faz; comentários explicam o que o código não consegue dizer sozinho.**

### Quando comentar (obrigatório)

- **Decisões não óbvias:** quando uma lógica poderia ser implementada de outra forma e existe um motivo específico para a escolha atual.
- **Restrições externas:** regras de negócio impostas pelo domínio que não ficam evidentes no código.
- **Workarounds e limitações conhecidas:** quando há uma solução provisória aguardando correção futura.

**Exemplos corretos:**

```js
// bcrypt exige custo mínimo 10 para conformidade com RNF002 (segurança)
const senhaHash = await bcrypt.hash(senha, 10);

// Saldo calculado via query para evitar inconsistência com cache
// Uma variável "quantidade" em Produto divergiria das movimentações
const saldo = await movimentacaoRepository.calcularSaldo(produtoId);
```

### Quando NÃO comentar (proibido)

- **Não repita o código em prosa:** se o código é legível, o comentário é ruído.
- **Não deixe código comentado no repositório:** use `git revert` ou branches para preservar versões antigas.
- **Não use comentários como TODO permanente:** abra uma issue no repositório.

**Exemplos incorretos:**

```js
// incrementa o contador
contador++;

// retorna o produto
return produto;

// TODO: arrumar isso depois (comentário permanente proibido)
```

---

## 5. Regra 4 — Responsabilidade Única (SOLID — S)

> **Cada classe, módulo ou função deve ter uma única razão para mudar. Se uma unidade de código faz mais de uma coisa, ela deve ser dividida.**

A arquitetura do projeto já impõe a separação em camadas: `routes → controllers → services → repositories`. Cada camada tem responsabilidade definida e **não deve assumir a do vizinho**.

| Camada | Responsabilidade única |
|--------|------------------------|
| `routes` | Mapear URLs para controllers |
| `controllers` | Receber requisição, delegar ao service, retornar resposta HTTP |
| `services` | Conter regras de negócio |
| `repositories` | Executar queries no banco de dados |

**Exemplo incorreto (controller fazendo o papel do service e do repository):**

```js
// ProdutoController — VIOLAÇÃO do SRP
async function cadastrar(req, res) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
  const existe = await db.query('SELECT * FROM Produto WHERE nome = ?', [nome]);
  if (existe.rows.length > 0) return res.status(409).json({ erro: 'Duplicado' });
  await db.query('INSERT INTO Produto (nome) VALUES (?)', [nome]);
  return res.status(201).json({ mensagem: 'Criado' });
}
```

**Exemplo correto (cada camada com sua responsabilidade):**

```js
// ProdutoController — apenas orquestra
async function cadastrar(req, res) {
  const produto = await produtoService.cadastrar(req.body, req.usuario.id);
  return res.status(201).json(produto);
}

// ProdutoService — regra de negócio
async function cadastrar(dto, usuarioId) {
  validarCampos(dto);
  await verificarNomeDuplicado(dto.nome);
  return produtoRepository.save(dto, usuarioId);
}

// ProdutoRepository — apenas acesso ao banco
async function save(dto, usuarioId) {
  return db.query('INSERT INTO Produto ...', [...]);
}
```

---

## 6. Regra 5 — Aberto para Extensão, Fechado para Modificação (SOLID — O)

> **Módulos devem estar abertos para extensão de comportamento, mas fechados para modificação de código existente e já testado.**

Na prática, isso significa que ao adicionar uma nova funcionalidade, **o código existente e estável não deve ser alterado**; em vez disso, crie novos módulos, funções ou classes que estendam o comportamento.

**Exemplo — adicionar novo tipo de relatório sem modificar o existente:**

```js
// Correto: cada relatório é independente, não altera os demais
// relatorioEstoqueService.js  — existente, não modificado
// relatorioMovimentacoesService.js — existente, não modificado
// relatorioVencimentoService.js — NOVO, criado sem tocar nos anteriores

// RelatorioController delega para o serviço correto via estratégia
const geradores = {
  estoque:       relatorioEstoqueService.gerar,
  movimentacoes: relatorioMovimentacoesService.gerar,
  vencimento:    relatorioVencimentoService.gerar,   // extensão
};

async function gerar(req, res) {
  const gerador = geradores[req.params.tipo];
  if (!gerador) return res.status(400).json({ erro: 'Tipo inválido' });
  return res.json(await gerador(req.query));
}
```

---

## 7. Regra 6 — Inversão de Dependência (SOLID — D)

> **Módulos de alto nível (services) não devem depender diretamente de módulos de baixo nível (repositories). Ambos devem depender de abstrações (interfaces/contratos).**

Na prática para Node.js sem TypeScript: **injete dependências** em vez de importá-las diretamente no corpo das funções. Isso facilita testes e substituição de implementações.

**Exemplo incorreto (dependência hardcoded):**

```js
// produtoService.js — acoplado diretamente ao repository
const produtoRepository = require('../repositories/produtoRepository');

async function cadastrar(dto) {
  return produtoRepository.save(dto); // impossível substituir em testes
}
```

**Exemplo correto (injeção de dependência):**

```js
// produtoService.js — recebe o repository como parâmetro
function criarProdutoService(produtoRepository) {
  return {
    async cadastrar(dto) {
      return produtoRepository.save(dto); // facilmente substituível em testes
    }
  };
}

module.exports = criarProdutoService;
```

---

## 8. Regra 7 — Funções Pequenas e com Propósito Único (Clean Code)

> **Uma função deve fazer uma coisa, fazê-la bem e fazer somente ela. Se for necessário usar a conjunção "e" para descrever o que uma função faz, ela deve ser dividida.**

### Limites recomendados

| Métrica | Limite recomendado |
|---------|--------------------|
| Linhas por função | 20 linhas |
| Parâmetros por função | 3 parâmetros |
| Nível de indentação | 2 níveis (evitar `if` dentro de `for` dentro de `if`) |

**Exemplo incorreto (função que faz múltiplas coisas):**

```js
async function processarMovimentacao(req, res) {
  // valida
  if (!req.body.produtoId) return res.status(400).json({ erro: 'Campo obrigatório' });
  if (req.body.quantidade <= 0) return res.status(400).json({ erro: 'Inválido' });
  // busca produto
  const produto = await db.query('SELECT * FROM Produto WHERE id = ?', [req.body.produtoId]);
  if (!produto) return res.status(404).json({ erro: 'Não encontrado' });
  // registra
  await db.query('INSERT INTO Movimentacao ...', [...]);
  // atualiza saldo
  await db.query('UPDATE Produto SET quantidade = quantidade + ? WHERE id = ?', [...]);
  return res.status(201).json({ mensagem: 'Registrado' });
}
```

**Exemplo correto (responsabilidades separadas em funções menores):**

```js
async function registrarEntrada(req, res) {
  const movimentacao = await movimentacaoService.registrarEntrada(req.body, req.usuario.id);
  return res.status(201).json(movimentacao);
}

// No service:
async function registrarEntrada(dto, usuarioId) {
  validarCamposMovimentacao(dto);
  await garantirProdutoAtivo(dto.produtoId);
  return movimentacaoRepository.salvarEntrada(dto, usuarioId);
}
```

---

## 9. Regra 8 — Proibição de Hardcode e Uso de Variáveis de Ambiente

> **Nenhum valor sensível ou configurável (senha, host de banco, chave secreta, porta, URL) pode aparecer diretamente no código-fonte. Todo valor configurável deve estar em variáveis de ambiente.**

### Valores que obrigatoriamente vão para `.env`

- Credenciais de banco de dados: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Chave de assinatura JWT: `JWT_SECRET`
- Porta do servidor: `PORT`
- Qualquer URL de serviço externo

### Regras de uso

- O arquivo `.env` **nunca deve ser commitado**. Ele está listado no `.gitignore`.
- O arquivo `.env.example` **deve ser mantido atualizado** com todas as chaves necessárias, mas sem os valores reais.
- No código, sempre acesse via `process.env.NOME_DA_VARIAVEL`.

**Exemplo incorreto:**

```js
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'minha_senha_123',   // PROIBIDO — expõe credencial
  database: 'guardiao_da_cozinha'
});

const token = jwt.sign(payload, 'segredo_fixo');  // PROIBIDO
```

**Exemplo correto:**

```js
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT),
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
```

---

## 10. Checklist de Revisão de Código

Antes de fazer um commit ou abrir um Pull Request, o autor deve confirmar todos os itens:

- [ ] O commit segue o formato Gitmoji com mensagem no imperativo (Regra 1).
- [ ] Todos os nomes de variáveis, funções e classes revelam a intenção sem precisar de comentário (Regra 2).
- [ ] Não há código comentado deixado no arquivo; comentários existentes explicam o PORQUÊ (Regra 3).
- [ ] Cada função, service e controller tem uma única responsabilidade identificável (Regra 4).
- [ ] Nova funcionalidade foi adicionada sem modificar módulos existentes e já testados (Regra 5).
- [ ] Services e controllers recebem suas dependências por injeção, sem importações hardcoded internas (Regra 6).
- [ ] Nenhuma função ultrapassa 20 linhas ou possui mais de 3 parâmetros (Regra 7).
- [ ] Nenhum valor sensível ou configurável está fixo no código-fonte (Regra 8).
- [ ] O arquivo `.env.example` foi atualizado caso uma nova variável de ambiente tenha sido criada.

---

> **Referências:**  
> MARTIN, Robert C. *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall, 2008.  
> MARTIN, Robert C. *Agile Software Development: Principles, Patterns, and Practices*. Prentice Hall, 2002.  
> Documento mantido pela equipe do projeto Guardião da Cozinha — versão 1.0, Junho de 2026.
