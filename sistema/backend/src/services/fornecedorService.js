const ErroNegocio = require('../utils/ErroNegocio');

function criarFornecedorService(fornecedorRepository) {
  return {
    async listar(filtro = '') {
      return fornecedorRepository.findAll(filtro);
    },

    async buscarPorId(id) {
      const fornecedor = await fornecedorRepository.findById(id);
      if (!fornecedor) throw new ErroNegocio('Fornecedor não encontrado.', 404);
      return fornecedor;
    },

    async cadastrar(nome, cnpj) {
      validarNome(nome);

      const duplicado = await fornecedorRepository.findByNome(nome.trim());
      if (duplicado) throw new ErroNegocio('Já existe um fornecedor com este nome.', 409);

      return fornecedorRepository.save(nome.trim(), cnpj?.trim() || null);
    },

    async atualizar(id, nome, cnpj) {
      await this.buscarPorId(id);
      validarNome(nome);

      const duplicado = await fornecedorRepository.findByNome(nome.trim(), id);
      if (duplicado) throw new ErroNegocio('Já existe outro fornecedor com este nome.', 409);

      return fornecedorRepository.update(id, nome.trim(), cnpj?.trim() || null);
    },

    async excluir(id) {
      await this.buscarPorId(id);

      const totalProdutos = await fornecedorRepository.countProdutosAtivos(id);
      if (totalProdutos > 0) {
        throw new ErroNegocio(
          'Este fornecedor possui produtos cadastrados e não pode ser excluído. ' +
          'Reatribua ou exclua os produtos primeiro.',
          422
        );
      }

      await fornecedorRepository.softDelete(id);
    },
  };
}

function validarNome(nome) {
  if (!nome || nome.trim().length === 0)
    throw new ErroNegocio('O campo Nome é obrigatório.');
  if (nome.trim().length > 60)
    throw new ErroNegocio('O Nome deve ter no máximo 60 caracteres.');
}

module.exports = criarFornecedorService;
