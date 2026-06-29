// usuario_id = 1 enquanto RF001 (autenticação JWT) não estiver implementado
function criarMovimentacaoController(movimentacaoService) {
  return {
    async listar(req, res, next) {
      try {
        const { produto_id = '0', tipo = '' } = req.query;
        const movimentacoes = await movimentacaoService.listar(Number(produto_id), tipo);
        return res.json(movimentacoes);
      } catch (erro) {
        next(erro);
      }
    },

    async registrarEntrada(req, res, next) {
      try {
        const { produto_id, quantidade, data } = req.body;
        const usuarioId = req.usuario?.id ?? 1;
        const mov = await movimentacaoService.registrarEntrada(
          Number(produto_id), usuarioId, Number(quantidade), data
        );
        return res.status(201).json(mov);
      } catch (erro) {
        next(erro);
      }
    },

    async registrarSaida(req, res, next) {
      try {
        const { produto_id, quantidade, data } = req.body;
        const usuarioId = req.usuario?.id ?? 1;
        const mov = await movimentacaoService.registrarSaida(
          Number(produto_id), usuarioId, Number(quantidade), data
        );
        return res.status(201).json(mov);
      } catch (erro) {
        next(erro);
      }
    },
  };
}

module.exports = criarMovimentacaoController;
