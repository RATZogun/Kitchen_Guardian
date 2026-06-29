function criarFornecedorRepository(db) {
  return {
    async findAll(filtro = '') {
      const { rows } = await db.query(
        `SELECT id, nome, cnpj, ativo
           FROM Fornecedor
          WHERE ativo = true
            AND ($1 = '' OR LOWER(nome) LIKE LOWER('%' || $1 || '%'))
          ORDER BY nome ASC`,
        [filtro]
      );
      return rows;
    },

    async findById(id) {
      const { rows } = await db.query(
        `SELECT id, nome, cnpj, ativo
           FROM Fornecedor
          WHERE id = $1 AND ativo = true`,
        [id]
      );
      return rows[0] || null;
    },

    async findByNome(nome, excluirId = null) {
      const query = excluirId
        ? `SELECT id FROM Fornecedor WHERE LOWER(nome) = LOWER($1) AND id != $2 AND ativo = true`
        : `SELECT id FROM Fornecedor WHERE LOWER(nome) = LOWER($1) AND ativo = true`;
      const params = excluirId ? [nome, excluirId] : [nome];
      const { rows } = await db.query(query, params);
      return rows[0] || null;
    },

    async save(nome, cnpj) {
      const { rows } = await db.query(
        `INSERT INTO Fornecedor (nome, cnpj)
              VALUES ($1, $2)
           RETURNING id, nome, cnpj, ativo`,
        [nome, cnpj || null]
      );
      return rows[0];
    },

    async update(id, nome, cnpj) {
      const { rows } = await db.query(
        `UPDATE Fornecedor
            SET nome = $1, cnpj = $2
          WHERE id = $3
          RETURNING id, nome, cnpj, ativo`,
        [nome, cnpj || null, id]
      );
      return rows[0];
    },

    async softDelete(id) {
      await db.query(`UPDATE Fornecedor SET ativo = false WHERE id = $1`, [id]);
    },

    async countProdutosAtivos(fornecedorId) {
      const { rows } = await db.query(
        `SELECT COUNT(*) AS total FROM Produto WHERE fornecedor_id = $1 AND ativo = true`,
        [fornecedorId]
      );
      return Number(rows[0].total);
    },
  };
}

module.exports = criarFornecedorRepository;
