function criarMovimentacaoRepository(db) {
  return {
    async findAll(produtoId = 0, tipo = '') {
      const { rows } = await db.query(
        `SELECT
           m.id,
           m.tipo,
           m.quantidade,
           m.data,
           m.criado_em,
           p.id        AS produto_id,
           p.nome      AS produto_nome,
           p.unidade   AS produto_unidade,
           u.id        AS usuario_id,
           u.nome      AS usuario_nome
         FROM Movimentacao m
         JOIN Produto  p ON p.id = m.produto_id
         JOIN Usuario  u ON u.id = m.usuario_id
         WHERE ($1 = 0 OR m.produto_id = $1)
           AND ($2 = '' OR m.tipo = $2)
         ORDER BY m.criado_em DESC
         LIMIT 200`,
        [produtoId, tipo]
      );
      return rows;
    },

    async calcularSaldo(produtoId) {
      const { rows } = await db.query(
        `SELECT COALESCE(
           SUM(CASE
             WHEN tipo = 'Entrada' THEN quantidade
             WHEN tipo = 'Saida'   THEN -quantidade
             ELSE 0
           END), 0
         ) AS saldo
         FROM Movimentacao
         WHERE produto_id = $1`,
        [produtoId]
      );
      return Number(rows[0].saldo);
    },

    async save(tipo, produtoId, usuarioId, quantidade, data) {
      const { rows } = await db.query(
        `INSERT INTO Movimentacao (tipo, produto_id, usuario_id, quantidade, data)
              VALUES ($1, $2, $3, $4, $5)
           RETURNING id, tipo, produto_id, usuario_id, quantidade, data, criado_em`,
        [tipo, produtoId, usuarioId, quantidade, data]
      );
      return rows[0];
    },
  };
}

module.exports = criarMovimentacaoRepository;
