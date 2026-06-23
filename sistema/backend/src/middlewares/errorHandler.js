const ErroNegocio = require('../utils/ErroNegocio');

// Middleware de tratamento centralizado de erros.
// Recebe erros lançados em qualquer rota e retorna a resposta HTTP adequada.
function errorHandler(erro, req, res, next) {
  if (erro instanceof ErroNegocio) {
    return res.status(erro.status).json({ erro: erro.message });
  }

  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
}

module.exports = errorHandler;
