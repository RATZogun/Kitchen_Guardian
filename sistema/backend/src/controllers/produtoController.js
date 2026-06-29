// usuario_id = 1 enquanto RF001 (autenticação JWT) não estiver implementado
function criarProdutoController(produtoService) {
  return {
    async listar(req, res, next) {
      try {
        const { nome = '', categoria_id = '0' } = req.query;
        const produtos = await produtoService.listar(nome, Number(categoria_id));
        return res.json(produtos);
      } catch (erro) {
        next(erro);
      }
    },

    async buscarPorId(req, res, next) {
      try {
        const produto = await produtoService.buscarPorId(Number(req.params.id));
        return res.json(produto);
      } catch (erro) {
        next(erro);
      }
    },

    async cadastrar(req, res, next) {
      try {
        const { nome, categoria_id, fornecedor_id, unidade, estoque_minimo, data_validade } = req.body;
        const usuarioId = req.usuario?.id ?? 1;
        const produto = await produtoService.cadastrar(
          nome, Number(categoria_id), fornecedor_id ? Number(fornecedor_id) : null,
          unidade, Number(estoque_minimo ?? 0), data_validade || null, usuarioId
        );
        return res.status(201).json(produto);
      } catch (erro) {
        next(erro);
      }
    },

    async atualizar(req, res, next) {
      try {
        const { nome, categoria_id, fornecedor_id, unidade, estoque_minimo, data_validade } = req.body;
        const produto = await produtoService.atualizar(
          Number(req.params.id),
          nome, Number(categoria_id), fornecedor_id ? Number(fornecedor_id) : null,
          unidade, Number(estoque_minimo ?? 0), data_validade || null
        );
        return res.json(produto);
      } catch (erro) {
        next(erro);
      }
    },

    async excluir(req, res, next) {
      try {
        await produtoService.excluir(Number(req.params.id));
        return res.status(200).json({ mensagem: 'Produto excluído com sucesso.' });
      } catch (erro) {
        next(erro);
      }
    },
  };
}

module.exports = criarProdutoController;
