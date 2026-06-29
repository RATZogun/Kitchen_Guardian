function criarProdutoRepository(db) {
  return {
    async findAll(filtro = '', categoriaId = 0) {
      const { rows } = await db.query(
        `SELECT
           p.id,
           p.nome,
           p.categoria_id,
           c.nome        AS categoria_nome,
           p.fornecedor_id,
           f.nome        AS fornecedor_nome,
           p.unidade,
           p.estoque_minimo,
           p.data_validade,
           p.ativo,
           p.criado_em,
           COALESCE(
             SUM(CASE
               WHEN m.tipo = 'Entrada' THEN m.quantidade
               WHEN m.tipo = 'Saida'   THEN -m.quantidade
               ELSE 0
             END), 0
           ) AS saldo
         FROM Produto p
         JOIN Categoria c   ON c.id = p.categoria_id
         LEFT JOIN Fornecedor f ON f.id = p.fornecedor_id
         LEFT JOIN Movimentacao m ON m.produto_id = p.id
         WHERE p.ativo = true
           AND ($1 = '' OR LOWER(p.nome) LIKE LOWER('%' || $1 || '%'))
           AND ($2 = 0 OR p.categoria_id = $2)
         GROUP BY p.id, p.nome, p.categoria_id, c.nome,
                  p.fornecedor_id, f.nome,
                  p.unidade, p.estoque_minimo, p.data_validade,
                  p.ativo, p.criado_em
         ORDER BY p.nome ASC`,
        [filtro, categoriaId]
      );
      return rows;
    },

    async findById(id) {
      const { rows } = await db.query(
        `SELECT
           p.id,
           p.nome,
           p.categoria_id,
           c.nome        AS categoria_nome,
           p.fornecedor_id,
           f.nome        AS fornecedor_nome,
           p.unidade,
           p.estoque_minimo,
           p.data_validade,
           p.ativo,
           p.criado_em,
           COALESCE(
             SUM(CASE
               WHEN m.tipo = 'Entrada' THEN m.quantidade
               WHEN m.tipo = 'Saida'   THEN -m.quantidade
               ELSE 0
             END), 0
           ) AS saldo
         FROM Produto p
         JOIN Categoria c   ON c.id = p.categoria_id
         LEFT JOIN Fornecedor f ON f.id = p.fornecedor_id
         LEFT JOIN Movimentacao m ON m.produto_id = p.id
         WHERE p.id = $1 AND p.ativo = true
         GROUP BY p.id, p.nome, p.categoria_id, c.nome,
                  p.fornecedor_id, f.nome,
                  p.unidade, p.estoque_minimo, p.data_validade,
                  p.ativo, p.criado_em`,
        [id]
      );
      return rows[0] || null;
    },

    async findByNome(nome, excluirId = null) {
      const query = excluirId
        ? `SELECT id FROM Produto WHERE LOWER(nome) = LOWER($1) AND id != $2 AND ativo = true`
        : `SELECT id FROM Produto WHERE LOWER(nome) = LOWER($1) AND ativo = true`;
      const params = excluirId ? [nome, excluirId] : [nome];
      const { rows } = await db.query(query, params);
      return rows[0] || null;
    },

    async save(nome, categoriaId, fornecedorId, unidade, estoqueMinimo, dataValidade, usuarioId) {
      const { rows } = await db.query(
        `INSERT INTO Produto (nome, categoria_id, fornecedor_id, unidade, estoque_minimo, data_validade, usuario_id)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, nome, categoria_id, fornecedor_id, unidade, estoque_minimo, data_validade, ativo, criado_em`,
        [nome, categoriaId, fornecedorId || null, unidade, estoqueMinimo, dataValidade || null, usuarioId]
      );
      return rows[0];
    },

    async update(id, nome, categoriaId, fornecedorId, unidade, estoqueMinimo, dataValidade) {
      const { rows } = await db.query(
        `UPDATE Produto
            SET nome = $1, categoria_id = $2, fornecedor_id = $3,
                unidade = $4, estoque_minimo = $5, data_validade = $6
          WHERE id = $7
          RETURNING id, nome, categoria_id, fornecedor_id, unidade, estoque_minimo, data_validade, ativo, criado_em`,
        [nome, categoriaId, fornecedorId || null, unidade, estoqueMinimo, dataValidade || null, id]
      );
      return rows[0];
    },

    async softDelete(id) {
      await db.query(`UPDATE Produto SET ativo = false WHERE id = $1`, [id]);
    },

    async countMovimentacoes(produtoId) {
      const { rows } = await db.query(
        `SELECT COUNT(*) AS total FROM Movimentacao WHERE produto_id = $1`,
        [produtoId]
      );
      return Number(rows[0].total);
    },
  };
}

module.exports = criarProdutoRepository;
