const criarCategoriaService = require('../src/services/categoriaService');
const ErroNegocio           = require('../src/utils/ErroNegocio');

function criarRepositoryMock(overrides = {}) {
  return {
    findAll:            jest.fn().mockResolvedValue([]),
    findById:           jest.fn().mockResolvedValue(null),
    findByNome:         jest.fn().mockResolvedValue(null),
    save:               jest.fn().mockResolvedValue({ id: 1, nome: 'Laticínios', descricao: null, ativo: true }),
    update:             jest.fn().mockResolvedValue({ id: 1, nome: 'Frios',      descricao: null, ativo: true }),
    softDelete:         jest.fn().mockResolvedValue(),
    countProdutosAtivos: jest.fn().mockResolvedValue(0),
    ...overrides,
  };
}

describe('CategoriaService — cadastrar', () => {
  it('cria categoria quando nome é único', async () => {
    const repo    = criarRepositoryMock();
    const service = criarCategoriaService(repo);

    const resultado = await service.cadastrar('Laticínios', null);

    expect(repo.save).toHaveBeenCalledWith('Laticínios', null);
    expect(resultado.nome).toBe('Laticínios');
  });

  it('lança ErroNegocio quando nome está vazio', async () => {
    const service = criarCategoriaService(criarRepositoryMock());
    await expect(service.cadastrar('', null)).rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio quando nome excede 60 caracteres', async () => {
    const service = criarCategoriaService(criarRepositoryMock());
    await expect(service.cadastrar('A'.repeat(61), null)).rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio 409 quando nome já existe', async () => {
    const repo = criarRepositoryMock({
      findByNome: jest.fn().mockResolvedValue({ id: 2 }),
    });
    const service = criarCategoriaService(repo);

    const erro = await service.cadastrar('Laticínios', null).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(409);
  });

  it('remove espaços extras do nome antes de salvar', async () => {
    const repo    = criarRepositoryMock();
    const service = criarCategoriaService(repo);

    await service.cadastrar('  Laticínios  ', null);
    expect(repo.save).toHaveBeenCalledWith('Laticínios', null);
  });
});

describe('CategoriaService — buscarPorId', () => {
  it('retorna a categoria quando encontrada', async () => {
    const categoriaEsperada = { id: 1, nome: 'Laticínios', descricao: null, ativo: true };
    const repo    = criarRepositoryMock({ findById: jest.fn().mockResolvedValue(categoriaEsperada) });
    const service = criarCategoriaService(repo);

    const resultado = await service.buscarPorId(1);
    expect(resultado).toEqual(categoriaEsperada);
  });

  it('lança ErroNegocio 404 quando não encontrada', async () => {
    const service = criarCategoriaService(criarRepositoryMock());

    const erro = await service.buscarPorId(99).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(404);
  });
});

describe('CategoriaService — atualizar', () => {
  it('atualiza categoria com dados válidos', async () => {
    const repo = criarRepositoryMock({
      findById: jest.fn().mockResolvedValue({ id: 1, nome: 'Laticínios', ativo: true }),
    });
    const service = criarCategoriaService(repo);

    const resultado = await service.atualizar(1, 'Frios', null);
    expect(repo.update).toHaveBeenCalledWith(1, 'Frios', null);
    expect(resultado.nome).toBe('Frios');
  });

  it('lança ErroNegocio 404 ao atualizar categoria inexistente', async () => {
    const service = criarCategoriaService(criarRepositoryMock());

    const erro = await service.atualizar(99, 'Frios', null).catch(e => e);
    expect(erro.status).toBe(404);
  });

  it('lança ErroNegocio 409 quando novo nome pertence a outra categoria', async () => {
    const repo = criarRepositoryMock({
      findById:   jest.fn().mockResolvedValue({ id: 1, nome: 'Laticínios', ativo: true }),
      findByNome: jest.fn().mockResolvedValue({ id: 2 }),
    });
    const service = criarCategoriaService(repo);

    const erro = await service.atualizar(1, 'Frios', null).catch(e => e);
    expect(erro.status).toBe(409);
  });
});

describe('CategoriaService — excluir', () => {
  it('exclui logicamente quando não há produtos vinculados', async () => {
    const repo = criarRepositoryMock({
      findById: jest.fn().mockResolvedValue({ id: 1, nome: 'Laticínios', ativo: true }),
    });
    const service = criarCategoriaService(repo);

    await service.excluir(1);
    expect(repo.softDelete).toHaveBeenCalledWith(1);
  });

  it('lança ErroNegocio 422 quando há produtos ativos vinculados', async () => {
    const repo = criarRepositoryMock({
      findById:            jest.fn().mockResolvedValue({ id: 1, nome: 'Laticínios', ativo: true }),
      countProdutosAtivos: jest.fn().mockResolvedValue(3),
    });
    const service = criarCategoriaService(repo);

    const erro = await service.excluir(1).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(422);
  });
});
