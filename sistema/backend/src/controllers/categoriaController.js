// Responsabilidade única: receber a requisição HTTP, delegar ao service
// e devolver a resposta. Não contém regras de negócio.
// Recebe o service por injeção de dependência (SOLID — D).
function criarCategoriaController(categoriaService) {
  return {
    async listar(req, res, next) {
      try {
        const { nome = '' } = req.query;
        const categorias = await categoriaService.listar(nome);
        return res.json(categorias);
      } catch (erro) {
        next(erro);
      }
    },

    async buscarPorId(req, res, next) {
      try {
        const categoria = await categoriaService.buscarPorId(Number(req.params.id));
        return res.json(categoria);
      } catch (erro) {
        next(erro);
      }
    },

    async cadastrar(req, res, next) {
      try {
        const { nome, descricao } = req.body;
        const categoria = await categoriaService.cadastrar(nome, descricao);
        return res.status(201).json(categoria);
      } catch (erro) {
        next(erro);
      }
    },

    async atualizar(req, res, next) {
      try {
        const { nome, descricao } = req.body;
        const categoria = await categoriaService.atualizar(
          Number(req.params.id),
          nome,
          descricao
        );
        return res.json(categoria);
      } catch (erro) {
        next(erro);
      }
    },

    async excluir(req, res, next) {
      try {
        await categoriaService.excluir(Number(req.params.id));
        return res.status(200).json({ mensagem: 'Categoria excluída com sucesso.' });
      } catch (erro) {
        next(erro);
      }
    },
  };
}

module.exports = criarCategoriaController;
