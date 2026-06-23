-- Criação do banco (execute uma vez antes de rodar a aplicação)
CREATE DATABASE IF NOT EXISTS guardiao_da_cozinha;

CREATE TABLE IF NOT EXISTS Categoria (
  id        SERIAL       PRIMARY KEY,
  nome      VARCHAR(60)  NOT NULL,
  descricao VARCHAR(200),
  ativo     BOOLEAN      NOT NULL DEFAULT true,
  CONSTRAINT uq_categoria_nome UNIQUE (nome)
);
