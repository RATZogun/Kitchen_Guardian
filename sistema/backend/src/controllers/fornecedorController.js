function criarFornecedorController(fornecedorService) {
  return {
    async listar(req, res, next) {
      try {
        const { nome = '' } = req.query;
        const fornecedores = await fornecedorService.listar(nome);
        return res.json(fornecedores);
      } catch (erro) {
        next(erro);
      }
    },

    async buscarPorId(req, res, next) {
      try {
        const fornecedor = await fornecedorService.buscarPorId(Number(req.params.id));
        return res.json(fornecedor);
      } catch (erro) {
        next(erro);
      }
    },

    async cadastrar(req, res, next) {
      try {
        const { nome, cnpj } = req.body;
        const fornecedor = await fornecedorService.cadastrar(nome, cnpj);
        return res.status(201).json(fornecedor);
      } catch (erro) {
        next(erro);
      }
    },

    async atualizar(req, res, next) {
      try {
        const { nome, cnpj } = req.body;
        const fornecedor = await fornecedorService.atualizar(Number(req.params.id), nome, cnpj);
        return res.json(fornecedor);
      } catch (erro) {
        next(erro);
      }
    },

    async excluir(req, res, next) {
      try {
        await fornecedorService.excluir(Number(req.params.id));
        return res.status(200).json({ mensagem: 'Fornecedor excluído com sucesso.' });
      } catch (erro) {
        next(erro);
      }
    },
  };
}

module.exports = criarFornecedorController;
