const ErroNegocio = require('../utils/ErroNegocio');

function criarMovimentacaoService(movimentacaoRepository, produtoRepository) {
  return {
    async listar(produtoId = 0, tipo = '') {
      return movimentacaoRepository.findAll(produtoId, tipo);
    },

    async registrarEntrada(produtoId, usuarioId, quantidade, data) {
      await validarRegistro(produtoRepository, produtoId, quantidade, data);
      return movimentacaoRepository.save('Entrada', produtoId, usuarioId, quantidade, data);
    },

    async registrarSaida(produtoId, usuarioId, quantidade, data) {
      await validarRegistro(produtoRepository, produtoId, quantidade, data);

      const saldoAtual = await movimentacaoRepository.calcularSaldo(produtoId);
      if (quantidade > saldoAtual) {
        throw new ErroNegocio(
          `Estoque insuficiente. Saldo atual: ${saldoAtual}.`,
          422
        );
      }

      return movimentacaoRepository.save('Saida', produtoId, usuarioId, quantidade, data);
    },
  };
}

async function validarRegistro(produtoRepository, produtoId, quantidade, data) {
  const produto = await produtoRepository.findById(produtoId);
  if (!produto) throw new ErroNegocio('Produto não encontrado ou inativo.', 404);

  const qtd = Number(quantidade);
  if (!Number.isInteger(qtd) || qtd <= 0)
    throw new ErroNegocio('A quantidade deve ser um número inteiro maior que zero.');

  if (!data) throw new ErroNegocio('A data é obrigatória.');
  if (new Date(data) > new Date())
    throw new ErroNegocio('A data da movimentação não pode ser posterior à data atual.');
}

module.exports = criarMovimentacaoService;
