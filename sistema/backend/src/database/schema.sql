-- Criação do banco: execute antes de rodar este script
-- psql -U postgres -c "CREATE DATABASE guardiao_da_cozinha;"
-- psql -U postgres -d guardiao_da_cozinha -f schema.sql

CREATE TABLE IF NOT EXISTS Categoria (
  id        SERIAL       PRIMARY KEY,
  nome      VARCHAR(60)  NOT NULL,
  descricao VARCHAR(200),
  ativo     BOOLEAN      NOT NULL DEFAULT true,
  CONSTRAINT uq_categoria_nome UNIQUE (nome)
);

CREATE TABLE IF NOT EXISTS Usuario (
  id         SERIAL       PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  perfil     VARCHAR(20)  NOT NULL CHECK (perfil IN ('Administrador', 'Operador', 'Gestor')),
  ativo      BOOLEAN      NOT NULL DEFAULT true,
  criado_em  TIMESTAMP    NOT NULL DEFAULT now(),
  CONSTRAINT uq_usuario_email UNIQUE (email)
);

-- Usuário padrão para uso antes da implementação de autenticação (RF001)
INSERT INTO Usuario (nome, email, senha_hash, perfil)
VALUES ('Administrador', 'admin@guardiaosc.com', '$2b$10$placeholder', 'Administrador')
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS Fornecedor (
  id    SERIAL       PRIMARY KEY,
  nome  VARCHAR(60)  NOT NULL,
  cnpj  VARCHAR(200),
  ativo BOOLEAN      NOT NULL DEFAULT true,
  CONSTRAINT uq_fornecedor_nome UNIQUE (nome)
);

CREATE TABLE IF NOT EXISTS Produto (
  id             SERIAL       PRIMARY KEY,
  nome           VARCHAR(100) NOT NULL,
  categoria_id   INTEGER      NOT NULL REFERENCES Categoria(id),
  fornecedor_id  INTEGER      REFERENCES Fornecedor(id),
  unidade        VARCHAR(5)   NOT NULL CHECK (unidade IN ('un', 'kg', 'g', 'l', 'ml')),
  estoque_minimo INTEGER      NOT NULL DEFAULT 0 CHECK (estoque_minimo >= 0),
  data_validade  DATE,
  usuario_id     INTEGER      NOT NULL REFERENCES Usuario(id),
  ativo          BOOLEAN      NOT NULL DEFAULT true,
  criado_em      TIMESTAMP    NOT NULL DEFAULT now(),
  CONSTRAINT uq_produto_nome UNIQUE (nome)
);

-- Para bancos já criados: adiciona a coluna se não existir
ALTER TABLE Produto ADD COLUMN IF NOT EXISTS fornecedor_id INTEGER REFERENCES Fornecedor(id);

CREATE TABLE IF NOT EXISTS Movimentacao (
  id          SERIAL      PRIMARY KEY,
  tipo        VARCHAR(10) NOT NULL CHECK (tipo IN ('Entrada', 'Saida')),
  produto_id  INTEGER     NOT NULL REFERENCES Produto(id),
  usuario_id  INTEGER     NOT NULL REFERENCES Usuario(id),
  quantidade  INTEGER     NOT NULL CHECK (quantidade > 0),
  data        DATE        NOT NULL,
  criado_em   TIMESTAMP   NOT NULL DEFAULT now()
);
