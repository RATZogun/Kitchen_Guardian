const { Router } = require('express');

function criarFornecedorRoutes(fornecedorController) {
  const router = Router();

  router.get('/',       (req, res, next) => fornecedorController.listar(req, res, next));
  router.get('/:id',    (req, res, next) => fornecedorController.buscarPorId(req, res, next));
  router.post('/',      (req, res, next) => fornecedorController.cadastrar(req, res, next));
  router.put('/:id',    (req, res, next) => fornecedorController.atualizar(req, res, next));
  router.delete('/:id', (req, res, next) => fornecedorController.excluir(req, res, next));

  return router;
}

module.exports = criarFornecedorRoutes;
