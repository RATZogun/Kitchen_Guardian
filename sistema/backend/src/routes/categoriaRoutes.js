const { Router } = require('express');

// Responsabilidade única: mapear URLs para os métodos do controller.
// Recebe o controller por injeção de dependência (SOLID — D).
function criarCategoriaRoutes(categoriaController) {
  const router = Router();

  router.get('/',     (req, res, next) => categoriaController.listar(req, res, next));
  router.get('/:id',  (req, res, next) => categoriaController.buscarPorId(req, res, next));
  router.post('/',    (req, res, next) => categoriaController.cadastrar(req, res, next));
  router.put('/:id',  (req, res, next) => categoriaController.atualizar(req, res, next));
  router.delete('/:id', (req, res, next) => categoriaController.excluir(req, res, next));

  return router;
}

module.exports = criarCategoriaRoutes;
