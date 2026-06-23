const ErroNegocio = require('../utils/ErroNegocio');

// Responsabilidade única: regras de negócio de Categoria.
// Recebe o repository por injeção de dependência (SOLID — D).
function criarCategoriaService(categoriaRepository) {
  return {
    async listar(filtro = '') {
      return categoriaRepository.findAll(filtro);
    },

    async buscarPorId(id) {
      const categoria = await categoriaRepository.findById(id);
      if (!categoria) throw new ErroNegocio('Categoria não encontrada.', 404);
      return categoria;
    },

    async cadastrar(nome, descricao) {
      validarNome(nome);

      const duplicada = await categoriaRepository.findByNome(nome.trim());
      if (duplicada) {
        throw new ErroNegocio('Já existe uma categoria com este nome.', 409);
      }

      return categoriaRepository.save(nome.trim(), descricao?.trim() || null);
    },

    async atualizar(id, nome, descricao) {
      await this.buscarPorId(id);
      validarNome(nome);

      const duplicada = await categoriaRepository.findByNome(nome.trim(), id);
      if (duplicada) {
        throw new ErroNegocio('Já existe outra categoria com este nome.', 409);
      }

      return categoriaRepository.update(id, nome.trim(), descricao?.trim() || null);
    },

    async excluir(id) {
      await this.buscarPorId(id);

      const totalProdutos = await categoriaRepository.countProdutosAtivos(id);
      if (totalProdutos > 0) {
        throw new ErroNegocio(
          'Esta categoria possui produtos cadastrados e não pode ser excluída. ' +
          'Reatribua ou exclua os produtos primeiro.',
          422
        );
      }

      await categoriaRepository.softDelete(id);
    },
  };
}

function validarNome(nome) {
  if (!nome || nome.trim().length === 0) {
    throw new ErroNegocio('O campo Nome é obrigatório.');
  }
  if (nome.trim().length > 60) {
    throw new ErroNegocio('O Nome deve ter no máximo 60 caracteres.');
  }
}

module.exports = criarCategoriaService;
