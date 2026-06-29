const { Router } = require('express');

function criarProdutoRoutes(produtoController) {
  const router = Router();

  router.get('/',      (req, res, next) => produtoController.listar(req, res, next));
  router.get('/:id',   (req, res, next) => produtoController.buscarPorId(req, res, next));
  router.post('/',     (req, res, next) => produtoController.cadastrar(req, res, next));
  router.put('/:id',   (req, res, next) => produtoController.atualizar(req, res, next));
  router.delete('/:id',(req, res, next) => produtoController.excluir(req, res, next));

  return router;
}

module.exports = criarProdutoRoutes;
