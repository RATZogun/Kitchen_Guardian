// Responsabilidade única: acesso ao banco de dados para a entidade Categoria.
// Recebe o pool de conexão por injeção de dependência (SOLID — D).
function criarCategoriaRepository(db) {
  return {
    async findAll(filtro = '') {
      const { rows } = await db.query(
        `SELECT id, nome, descricao, ativo
           FROM Categoria
          WHERE ativo = true
            AND ($1 = '' OR LOWER(nome) LIKE LOWER('%' || $1 || '%'))
          ORDER BY nome ASC`,
        [filtro]
      );
      return rows;
    },

    async findById(id) {
      const { rows } = await db.query(
        `SELECT id, nome, descricao, ativo
           FROM Categoria
          WHERE id = $1 AND ativo = true`,
        [id]
      );
      return rows[0] || null;
    },

    async findByNome(nome, excluirId = null) {
      const query = excluirId
        ? `SELECT id FROM Categoria
            WHERE LOWER(nome) = LOWER($1) AND id != $2 AND ativo = true`
        : `SELECT id FROM Categoria
            WHERE LOWER(nome) = LOWER($1) AND ativo = true`;

      const params = excluirId ? [nome, excluirId] : [nome];
      const { rows } = await db.query(query, params);
      return rows[0] || null;
    },

    async save(nome, descricao) {
      const { rows } = await db.query(
        `INSERT INTO Categoria (nome, descricao)
              VALUES ($1, $2)
           RETURNING id, nome, descricao, ativo`,
        [nome, descricao || null]
      );
      return rows[0];
    },

    async update(id, nome, descricao) {
      const { rows } = await db.query(
        `UPDATE Categoria
            SET nome = $1, descricao = $2
          WHERE id = $3
          RETURNING id, nome, descricao, ativo`,
        [nome, descricao || null, id]
      );
      return rows[0];
    },

    async softDelete(id) {
      await db.query(
        `UPDATE Categoria SET ativo = false WHERE id = $1`,
        [id]
      );
    },

    async countProdutosAtivos(categoriaId) {
      // Impede exclusão de categoria com produtos vinculados (RF005 — RN02)
      const { rows } = await db.query(
        `SELECT COUNT(*) AS total
           FROM Produto
          WHERE categoria_id = $1 AND ativo = true`,
        [categoriaId]
      );
      return Number(rows[0].total);
    },
  };
}

module.exports = criarCategoriaRepository;
