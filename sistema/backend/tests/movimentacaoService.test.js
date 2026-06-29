const criarMovimentacaoService = require('../src/services/movimentacaoService');
const ErroNegocio              = require('../src/utils/ErroNegocio');

const PRODUTO_ATIVO = { id: 1, nome: 'Leite Integral', unidade: 'l', ativo: true };
const MOV_ENTRADA   = { id: 1, tipo: 'Entrada', produto_id: 1, usuario_id: 1, quantidade: 10, data: '2026-06-01' };
const MOV_SAIDA     = { id: 2, tipo: 'Saida',   produto_id: 1, usuario_id: 1, quantidade: 5,  data: '2026-06-02' };

const DATA_HOJE    = new Date().toISOString().slice(0, 10);
const DATA_ONTEM   = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const DATA_FUTURO  = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

function criarMovRepoMock(overrides = {}) {
  return {
    findAll:       jest.fn().mockResolvedValue([]),
    calcularSaldo: jest.fn().mockResolvedValue(20),
    save:          jest.fn().mockResolvedValue(MOV_ENTRADA),
    ...overrides,
  };
}

function criarProdRepoMock(overrides = {}) {
  return {
    findById: jest.fn().mockResolvedValue(PRODUTO_ATIVO),
    ...overrides,
  };
}

function criarService(movOvr = {}, prodOvr = {}) {
  return criarMovimentacaoService(criarMovRepoMock(movOvr), criarProdRepoMock(prodOvr));
}

// ─── listar ──────────────────────────────────────────────────────────────────

describe('MovimentacaoService — listar', () => {
  it('retorna lista vazia quando não há movimentações', async () => {
    const service = criarService();
    const resultado = await service.listar(0, '');
    expect(resultado).toEqual([]);
  });

  it('repassa filtros de produto_id e tipo ao repository', async () => {
    const movRepo = criarMovRepoMock();
    const service = criarMovimentacaoService(movRepo, criarProdRepoMock());

    await service.listar(1, 'Entrada');
    expect(movRepo.findAll).toHaveBeenCalledWith(1, 'Entrada');
  });
});

// ─── registrarEntrada ─────────────────────────────────────────────────────────

describe('MovimentacaoService — registrarEntrada', () => {
  it('registra entrada com dados válidos', async () => {
    const movRepo = criarMovRepoMock({ save: jest.fn().mockResolvedValue(MOV_ENTRADA) });
    const service = criarMovimentacaoService(movRepo, criarProdRepoMock());

    const resultado = await service.registrarEntrada(1, 1, 10, DATA_HOJE);

    expect(movRepo.save).toHaveBeenCalledWith('Entrada', 1, 1, 10, DATA_HOJE);
    expect(resultado.tipo).toBe('Entrada');
  });

  it('lança ErroNegocio 404 quando produto não existe', async () => {
    const service = criarService({}, { findById: jest.fn().mockResolvedValue(null) });
    const erro = await service.registrarEntrada(99, 1, 10, DATA_HOJE).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(404);
  });

  it('lança ErroNegocio quando quantidade é zero', async () => {
    const service = criarService();
    await expect(service.registrarEntrada(1, 1, 0, DATA_HOJE)).rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio quando quantidade é negativa', async () => {
    const service = criarService();
    await expect(service.registrarEntrada(1, 1, -5, DATA_HOJE)).rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio quando quantidade não é inteira', async () => {
    const service = criarService();
    await expect(service.registrarEntrada(1, 1, 2.5, DATA_HOJE)).rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio quando data é futura', async () => {
    const service = criarService();
    await expect(service.registrarEntrada(1, 1, 10, DATA_FUTURO)).rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio quando data está ausente', async () => {
    const service = criarService();
    await expect(service.registrarEntrada(1, 1, 10, null)).rejects.toBeInstanceOf(ErroNegocio);
  });

  it('aceita data de ontem como válida', async () => {
    const service = criarService();
    await expect(service.registrarEntrada(1, 1, 10, DATA_ONTEM)).resolves.toBeDefined();
  });
});

// ─── registrarSaida ──────────────────────────────────────────────────────────

describe('MovimentacaoService — registrarSaida', () => {
  it('registra saída quando há saldo suficiente', async () => {
    const movRepo = criarMovRepoMock({
      calcularSaldo: jest.fn().mockResolvedValue(20),
      save:          jest.fn().mockResolvedValue(MOV_SAIDA),
    });
    const service = criarMovimentacaoService(movRepo, criarProdRepoMock());

    const resultado = await service.registrarSaida(1, 1, 5, DATA_HOJE);

    expect(movRepo.save).toHaveBeenCalledWith('Saida', 1, 1, 5, DATA_HOJE);
    expect(resultado.tipo).toBe('Saida');
  });

  it('lança ErroNegocio 422 quando saldo é insuficiente', async () => {
    const service = criarService({ calcularSaldo: jest.fn().mockResolvedValue(3) });
    const erro = await service.registrarSaida(1, 1, 10, DATA_HOJE).catch(e => e);
    expect(erro).toBeInstanceOf(ErroNegocio);
    expect(erro.status).toBe(422);
  });

  it('lança ErroNegocio quando saldo é exatamente zero', async () => {
    const service = criarService({ calcularSaldo: jest.fn().mockResolvedValue(0) });
    const erro = await service.registrarSaida(1, 1, 1, DATA_HOJE).catch(e => e);
    expect(erro.status).toBe(422);
  });

  it('lança ErroNegocio 404 quando produto não existe', async () => {
    const service = criarService({}, { findById: jest.fn().mockResolvedValue(null) });
    const erro = await service.registrarSaida(99, 1, 5, DATA_HOJE).catch(e => e);
    expect(erro.status).toBe(404);
  });

  it('lança ErroNegocio quando quantidade é zero', async () => {
    const service = criarService();
    await expect(service.registrarSaida(1, 1, 0, DATA_HOJE)).rejects.toBeInstanceOf(ErroNegocio);
  });

  it('lança ErroNegocio quando data é futura', async () => {
    const service = criarService();
    await expect(service.registrarSaida(1, 1, 5, DATA_FUTURO)).rejects.toBeInstanceOf(ErroNegocio);
  });

  it('permite saída com quantidade exatamente igual ao saldo', async () => {
    const service = criarService({ calcularSaldo: jest.fn().mockResolvedValue(10) });
    await expect(service.registrarSaida(1, 1, 10, DATA_HOJE)).resolves.toBeDefined();
  });
});
