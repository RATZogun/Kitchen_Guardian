const criarProdutoService  = require('../src/services/produtoService');
const ErroNegocio          = require('../src/utils/ErroNegocio');

const PRODUTO_SALVO = {
  id: 1, nome: 'Leite Integral', categoria_id: 1, fornecedor_id: 1,
  unidade: 'l', estoque_minimo: 5, data_validade: null, ativo: true,
};

const CATEGORIA_ATIVA    = { id: 1, nome: 'Laticínios', ativo: true };
const FORNECEDOR_ATIVO   = { id: 1, nome: 'Distribuidora XYZ', ativo: true };

function criarProdutoRepoMock(overrides = {}) {
  return {
    findAll:           jest.fn().mockResolvedValue([]),
    findById:          jest.fn().mockResolvedValue(null),
    findByNome:        jest.fn().mockResolvedValue(null),
    save:              jest.fn().mockResolvedValue(PRODUTO_SALVO),
    update:            jest.fn().mockResolvedValue({ ...PRODUTO_SALVO, nome: 'Leite Desnatado' }),
    softDelete:        jest.fn().mockResolvedValue(),
    countMovimentacoes: jest.fn().mockResolvedValue(0),
    ...overrides,
  };
}

function criarCategoriaRepoMock(overrides = {}) {
  return {
    findById:  jest.fn().mockResolvedValue(CATEGORIA_ATIVA),
    findByNome: jest.fn().mockResolvedValue(null),
    ...overrides,
  };
}

function criarFornecedorRepoMock(overrides = {}) {
  return {
    findById: jest.fn().mockResolvedValue(FORNECEDOR_ATIVO),
    ...overrides,
  };
}

function criarService(prodOvr = {}, catOvr = {}, forOvr = {}) {
  return criarProdutoService(
    criarProdutoRepoMock(prodOvr),
    criarCategoriaRepoMock(catOvr),
    criarFornecedorRepoMock(forOvr)
  );
}

// ─── cadastrar ───────────────────────────────────────────────────────────────

describe('ProdutoService — cadastrar', () => {
  it('cria produto quando todos os dados são válidos', async () => {
    const prodRepo = criarProdutoRepoMock();
    const service  = criarProdutoService(prodRepo, criarCategoriaRepoMock(), criarFornecedorRepoMock());

    const resultado = await service.cadastrar('Leite Integral', 1, 1, 'l', 5, null, 1);

    expect(prodRepo.save).toHaveBeenCalledWith('Leite Integral', 1, 1, 'l', 5, null, 1);
    expect(resultado.nome).toBe('Leite Integral');
  });

  it('lança ErroNegocio quando nome está vazio', async () => {
    const service = criarService();
    await expect(service.cadastrar('', 1, null, 'l', 0, null, 1))
      .rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio quando nome excede 100 caracteres', async () => {
    const service = criarService();
    await expect(service.cadastrar('A'.repeat(101), 1, null, 'l', 0, null, 1))
      .rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio quando unidade é inválida', async () => {
    const service = criarService();
    await expect(service.cadastrar('Produto X', 1, null, 'xpto', 0, null, 1))
      .rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio quando estoque mínimo é negativo', async () => {
    const service = criarService();
    await expect(service.cadastrar('Produto X', 1, null, 'un', -1, null, 1))
      .rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio 422 quando categoria não existe ou está inativa', async () => {
    const service = criarService({}, { findById: jest.fn().mockResolvedValue(null) });
    const erro = await service.cadastrar('Leite', 99, null, 'l', 0, null, 1).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(422);
  });

  it('lança ErroNegocio 422 quando fornecedor não existe ou está inativo', async () => {
    const service = criarService({}, {}, { findById: jest.fn().mockResolvedValue(null) });
    const erro = await service.cadastrar('Leite', 1, 99, 'l', 0, null, 1).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(422);
  });

  it('lança ErroNegocio 409 quando nome já existe', async () => {
    const service = criarService({ findByNome: jest.fn().mockResolvedValue({ id: 2 }) });
    const erro = await service.cadastrar('Leite Integral', 1, null, 'l', 0, null, 1).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(409);
  });

  it('remove espaços extras do nome antes de salvar', async () => {
    const prodRepo = criarProdutoRepoMock();
    const service  = criarProdutoService(prodRepo, criarCategoriaRepoMock(), criarFornecedorRepoMock());
    await service.cadastrar('  Leite Integral  ', 1, null, 'l', 0, null, 1);
    expect(prodRepo.save).toHaveBeenCalledWith('Leite Integral', 1, null, 'l', 0, null, 1);
  });
});

// ─── buscarPorId ─────────────────────────────────────────────────────────────

describe('ProdutoService — buscarPorId', () => {
  it('retorna produto quando encontrado', async () => {
    const service = criarService({ findById: jest.fn().mockResolvedValue(PRODUTO_SALVO) });
    const resultado = await service.buscarPorId(1);
    expect(resultado).toEqual(PRODUTO_SALVO);
  });

  it('lança ErroNegocio 404 quando produto não existe', async () => {
    const service = criarService();
    const erro = await service.buscarPorId(99).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(404);
  });
});

// ─── atualizar ───────────────────────────────────────────────────────────────

describe('ProdutoService — atualizar', () => {
  it('atualiza produto com dados válidos', async () => {
    const prodRepo = criarProdutoRepoMock({
      findById: jest.fn().mockResolvedValue(PRODUTO_SALVO),
    });
    const service = criarProdutoService(prodRepo, criarCategoriaRepoMock(), criarFornecedorRepoMock());

    const resultado = await service.atualizar(1, 'Leite Desnatado', 1, null, 'l', 5, null);
    expect(prodRepo.update).toHaveBeenCalled();
    expect(resultado.nome).toBe('Leite Desnatado');
  });

  it('lança ErroNegocio 404 ao atualizar produto inexistente', async () => {
    const service = criarService();
    const erro = await service.atualizar(99, 'X', 1, null, 'un', 0, null).catch(e => e);
    expect(erro.status).toBe(404);
  });

  it('lança ErroNegocio 409 quando novo nome pertence a outro produto', async () => {
    const service = criarService({
      findById:   jest.fn().mockResolvedValue(PRODUTO_SALVO),
      findByNome: jest.fn().mockResolvedValue({ id: 2 }),
    });
    const erro = await service.atualizar(1, 'Leite Desnatado', 1, null, 'l', 0, null).catch(e => e);
    expect(erro.status).toBe(409);
  });

  it('lança ErroNegocio 422 quando nova categoria é inválida', async () => {
    const service = criarService(
      { findById: jest.fn().mockResolvedValue(PRODUTO_SALVO) },
      { findById: jest.fn().mockResolvedValue(null) }
    );
    const erro = await service.atualizar(1, 'Leite', 99, null, 'l', 0, null).catch(e => e);
    expect(erro.status).toBe(422);
  });
});

// ─── excluir ─────────────────────────────────────────────────────────────────

describe('ProdutoService — excluir', () => {
  it('exclui logicamente preservando histórico de movimentações', async () => {
    const prodRepo = criarProdutoRepoMock({
      findById:           jest.fn().mockResolvedValue(PRODUTO_SALVO),
      countMovimentacoes: jest.fn().mockResolvedValue(5),
    });
    const service = criarProdutoService(prodRepo, criarCategoriaRepoMock(), criarFornecedorRepoMock());

    await service.excluir(1);
    expect(prodRepo.softDelete).toHaveBeenCalledWith(1);
  });

  it('lança ErroNegocio 404 ao excluir produto inexistente', async () => {
    const service = criarService();
    const erro = await service.excluir(99).catch(e => e);
    expect(erro.status).toBe(404);
  });
});
