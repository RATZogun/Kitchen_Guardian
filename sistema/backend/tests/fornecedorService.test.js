const criarFornecedorService = require('../src/services/fornecedorService');
const ErroNegocio            = require('../src/utils/ErroNegocio');

const FORNECEDOR_SALVO = { id: 1, nome: 'Distribuidora XYZ', cnpj: '12.345.678/0001-90', ativo: true };

function criarRepoMock(overrides = {}) {
  return {
    findAll:            jest.fn().mockResolvedValue([]),
    findById:           jest.fn().mockResolvedValue(null),
    findByNome:         jest.fn().mockResolvedValue(null),
    save:               jest.fn().mockResolvedValue(FORNECEDOR_SALVO),
    update:             jest.fn().mockResolvedValue({ ...FORNECEDOR_SALVO, nome: 'Novo Fornecedor' }),
    softDelete:         jest.fn().mockResolvedValue(),
    countProdutosAtivos: jest.fn().mockResolvedValue(0),
    ...overrides,
  };
}

// ─── cadastrar ───────────────────────────────────────────────────────────────

describe('FornecedorService — cadastrar', () => {
  it('cria fornecedor quando nome é único', async () => {
    const repo    = criarRepoMock();
    const service = criarFornecedorService(repo);

    const resultado = await service.cadastrar('Distribuidora XYZ', '12.345.678/0001-90');

    expect(repo.save).toHaveBeenCalledWith('Distribuidora XYZ', '12.345.678/0001-90');
    expect(resultado.nome).toBe('Distribuidora XYZ');
  });

  it('aceita cnpj nulo (campo opcional)', async () => {
    const repo    = criarRepoMock();
    const service = criarFornecedorService(repo);

    await service.cadastrar('Distribuidora XYZ', null);
    expect(repo.save).toHaveBeenCalledWith('Distribuidora XYZ', null);
  });

  it('lança ErroNegocio quando nome está vazio', async () => {
    const service = criarFornecedorService(criarRepoMock());
    await expect(service.cadastrar('', null)).rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio quando nome excede 60 caracteres', async () => {
    const service = criarFornecedorService(criarRepoMock());
    await expect(service.cadastrar('A'.repeat(61), null)).rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio 409 quando nome já existe', async () => {
    const repo = criarRepoMock({ findByNome: jest.fn().mockResolvedValue({ id: 2 }) });
    const service = criarFornecedorService(repo);

    const erro = await service.cadastrar('Distribuidora XYZ', null).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(409);
  });

  it('remove espaços extras do nome e cnpj antes de salvar', async () => {
    const repo    = criarRepoMock();
    const service = criarFornecedorService(repo);

    await service.cadastrar('  Distribuidora XYZ  ', '  12.345.678/0001-90  ');
    expect(repo.save).toHaveBeenCalledWith('Distribuidora XYZ', '12.345.678/0001-90');
  });
});

// ─── buscarPorId ─────────────────────────────────────────────────────────────

describe('FornecedorService — buscarPorId', () => {
  it('retorna fornecedor quando encontrado', async () => {
    const repo    = criarRepoMock({ findById: jest.fn().mockResolvedValue(FORNECEDOR_SALVO) });
    const service = criarFornecedorService(repo);

    const resultado = await service.buscarPorId(1);
    expect(resultado).toEqual(FORNECEDOR_SALVO);
  });

  it('lança ErroNegocio 404 quando não encontrado', async () => {
    const service = criarFornecedorService(criarRepoMock());
    const erro = await service.buscarPorId(99).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(404);
  });
});

// ─── atualizar ───────────────────────────────────────────────────────────────

describe('FornecedorService — atualizar', () => {
  it('atualiza fornecedor com dados válidos', async () => {
    const repo = criarRepoMock({
      findById: jest.fn().mockResolvedValue(FORNECEDOR_SALVO),
    });
    const service = criarFornecedorService(repo);

    const resultado = await service.atualizar(1, 'Novo Fornecedor', null);
    expect(repo.update).toHaveBeenCalledWith(1, 'Novo Fornecedor', null);
    expect(resultado.nome).toBe('Novo Fornecedor');
  });

  it('lança ErroNegocio 404 ao atualizar fornecedor inexistente', async () => {
    const service = criarFornecedorService(criarRepoMock());
    const erro = await service.atualizar(99, 'X', null).catch(e => e);
    expect(erro.status).toBe(404);
  });

  it('lança ErroNegocio 409 quando novo nome pertence a outro fornecedor', async () => {
    const repo = criarRepoMock({
      findById:   jest.fn().mockResolvedValue(FORNECEDOR_SALVO),
      findByNome: jest.fn().mockResolvedValue({ id: 2 }),
    });
    const service = criarFornecedorService(repo);

    const erro = await service.atualizar(1, 'Novo Fornecedor', null).catch(e => e);
    expect(erro.status).toBe(409);
  });

  it('lança ErroNegocio quando novo nome está vazio', async () => {
    const repo = criarRepoMock({
      findById: jest.fn().mockResolvedValue(FORNECEDOR_SALVO),
    });
    const service = criarFornecedorService(repo);
    await expect(service.atualizar(1, '', null)).rejects.toBeInstanceOf(ErroNegocio);
  });
});

// ─── excluir ─────────────────────────────────────────────────────────────────

describe('FornecedorService — excluir', () => {
  it('exclui logicamente quando não há produtos vinculados', async () => {
    const repo = criarRepoMock({
      findById: jest.fn().mockResolvedValue(FORNECEDOR_SALVO),
    });
    const service = criarFornecedorService(repo);

    await service.excluir(1);
    expect(repo.softDelete).toHaveBeenCalledWith(1);
  });

  it('lança ErroNegocio 422 quando há produtos ativos vinculados', async () => {
    const repo = criarRepoMock({
      findById:            jest.fn().mockResolvedValue(FORNECEDOR_SALVO),
      countProdutosAtivos: jest.fn().mockResolvedValue(2),
    });
    const service = criarFornecedorService(repo);

    const erro = await service.excluir(1).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(422);
  });

  it('lança ErroNegocio 404 ao excluir fornecedor inexistente', async () => {
    const service = criarFornecedorService(criarRepoMock());
    const erro = await service.excluir(99).catch(e => e);
    expect(erro.status).toBe(404);
  });
});
