const ErroNegocio = require('../utils/ErroNegocio');

const UNIDADES_VALIDAS = ['un', 'kg', 'g', 'l', 'ml'];

function criarProdutoService(produtoRepository, categoriaRepository, fornecedorRepository) {
  return {
    async listar(filtro = '', categoriaId = 0) {
      return produtoRepository.findAll(filtro, categoriaId);
    },

    async buscarPorId(id) {
      const produto = await produtoRepository.findById(id);
      if (!produto) throw new ErroNegocio('Produto não encontrado.', 404);
      return produto;
    },

    async cadastrar(nome, categoriaId, fornecedorId, unidade, estoqueMinimo, dataValidade, usuarioId) {
      validarCampos(nome, unidade, estoqueMinimo);

      const categoria = await categoriaRepository.findById(categoriaId);
      if (!categoria) throw new ErroNegocio('Categoria inválida. Selecione uma categoria ativa.', 422);

      if (fornecedorId) {
        const fornecedor = await fornecedorRepository.findById(fornecedorId);
        if (!fornecedor) throw new ErroNegocio('Fornecedor inválido. Selecione um fornecedor ativo.', 422);
      }

      const duplicado = await produtoRepository.findByNome(nome.trim());
      if (duplicado) throw new ErroNegocio('Já existe um produto com este nome.', 409);

      return produtoRepository.save(
        nome.trim(),
        categoriaId,
        fornecedorId || null,
        unidade,
        estoqueMinimo ?? 0,
        dataValidade || null,
        usuarioId
      );
    },

    async atualizar(id, nome, categoriaId, fornecedorId, unidade, estoqueMinimo, dataValidade) {
      await this.buscarPorId(id);
      validarCampos(nome, unidade, estoqueMinimo);

      const categoria = await categoriaRepository.findById(categoriaId);
      if (!categoria) throw new ErroNegocio('Categoria inválida.', 422);

      if (fornecedorId) {
        const fornecedor = await fornecedorRepository.findById(fornecedorId);
        if (!fornecedor) throw new ErroNegocio('Fornecedor inválido.', 422);
      }

      const duplicado = await produtoRepository.findByNome(nome.trim(), id);
      if (duplicado) throw new ErroNegocio('Já existe outro produto com este nome.', 409);

      return produtoRepository.update(
        id,
        nome.trim(),
        categoriaId,
        fornecedorId || null,
        unidade,
        estoqueMinimo ?? 0,
        dataValidade || null
      );
    },

    async excluir(id) {
      await this.buscarPorId(id);

      const totalMovimentacoes = await produtoRepository.countMovimentacoes(id);
      if (totalMovimentacoes > 0) {
        // RF009 — aviso mas prossegue com exclusão lógica preservando histórico
      }

      await produtoRepository.softDelete(id);
    },
  };
}

function validarCampos(nome, unidade, estoqueMinimo) {
  if (!nome || nome.trim().length === 0)
    throw new ErroNegocio('O campo Nome é obrigatório.');
  if (nome.trim().length > 100)
    throw new ErroNegocio('O Nome deve ter no máximo 100 caracteres.');
  if (!UNIDADES_VALIDAS.includes(unidade))
    throw new ErroNegocio(`Unidade inválida. Use: ${UNIDADES_VALIDAS.join(', ')}.`);
  if (estoqueMinimo !== undefined && estoqueMinimo !== null && Number(estoqueMinimo) < 0)
    throw new ErroNegocio('O Estoque mínimo deve ser maior ou igual a zero.');
}

module.exports = criarProdutoService;
