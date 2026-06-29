require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const db = require('./database/connection');

const criarCategoriaRepository    = require('./repositories/categoriaRepository');
const criarCategoriaService       = require('./services/categoriaService');
const criarCategoriaController    = require('./controllers/categoriaController');
const criarCategoriaRoutes        = require('./routes/categoriaRoutes');

const criarProdutoRepository      = require('./repositories/produtoRepository');
const criarProdutoService         = require('./services/produtoService');
const criarProdutoController      = require('./controllers/produtoController');
const criarProdutoRoutes          = require('./routes/produtoRoutes');

const criarFornecedorRepository   = require('./repositories/fornecedorRepository');
const criarFornecedorService      = require('./services/fornecedorService');
const criarFornecedorController   = require('./controllers/fornecedorController');
const criarFornecedorRoutes       = require('./routes/fornecedorRoutes');

const criarMovimentacaoRepository = require('./repositories/movimentacaoRepository');
const criarMovimentacaoService    = require('./services/movimentacaoService');
const criarMovimentacaoController = require('./controllers/movimentacaoController');
const criarMovimentacaoRoutes     = require('./routes/movimentacaoRoutes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// Composição das dependências (Dependency Injection manual)
const categoriaRepository    = criarCategoriaRepository(db);
const categoriaService       = criarCategoriaService(categoriaRepository);
const categoriaController    = criarCategoriaController(categoriaService);
const categoriaRoutes        = criarCategoriaRoutes(categoriaController);

const fornecedorRepository   = criarFornecedorRepository(db);
const fornecedorService      = criarFornecedorService(fornecedorRepository);
const fornecedorController   = criarFornecedorController(fornecedorService);
const fornecedorRoutes       = criarFornecedorRoutes(fornecedorController);

const produtoRepository      = criarProdutoRepository(db);
const produtoService         = criarProdutoService(produtoRepository, categoriaRepository, fornecedorRepository);
const produtoController      = criarProdutoController(produtoService);
const produtoRoutes          = criarProdutoRoutes(produtoController);

const movimentacaoRepository = criarMovimentacaoRepository(db);
const movimentacaoService    = criarMovimentacaoService(movimentacaoRepository, produtoRepository);
const movimentacaoController = criarMovimentacaoController(movimentacaoService);
const movimentacaoRoutes     = criarMovimentacaoRoutes(movimentacaoController);

app.use('/categorias',    categoriaRoutes);
app.use('/fornecedores',  fornecedorRoutes);
app.use('/produtos',      produtoRoutes);
app.use('/movimentacoes', movimentacaoRoutes);

// Deve ser o último middleware registrado
app.use(errorHandler);

module.exports = app;
