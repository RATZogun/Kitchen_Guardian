const { Router } = require('express');

function criarMovimentacaoRoutes(movimentacaoController) {
  const router = Router();

  router.get('/',       (req, res, next) => movimentacaoController.listar(req, res, next));
  router.post('/entrada', (req, res, next) => movimentacaoController.registrarEntrada(req, res, next));
  router.post('/saida',   (req, res, next) => movimentacaoController.registrarSaida(req, res, next));

  return router;
}

module.exports = criarMovimentacaoRoutes;
