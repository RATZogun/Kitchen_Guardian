require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const db                    = require('./database/connection');
const criarCategoriaRepository = require('./repositories/categoriaRepository');
const criarCategoriaService    = require('./services/categoriaService');
const criarCategoriaController = require('./controllers/categoriaController');
const criarCategoriaRoutes     = require('./routes/categoriaRoutes');
const errorHandler             = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// Composição das dependências (Dependency Injection manual)
const categoriaRepository = criarCategoriaRepository(db);
const categoriaService    = criarCategoriaService(categoriaRepository);
const categoriaController = criarCategoriaController(categoriaService);
const categoriaRoutes     = criarCategoriaRoutes(categoriaController);

app.use('/categorias', categoriaRoutes);

// Deve ser o último middleware registrado
app.use(errorHandler);

module.exports = app;
