CREATE SCHEMA MaUrban;
USE MaUrban;

CREATE TABLE cliente (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE produto (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco_atual DECIMAL(10, 2) NOT NULL,
    quant_estoque INT NOT NULL
);

CREATE TABLE pedido (
    id VARCHAR(36) PRIMARY KEY,
    valor_total_pedido DECIMAL(10, 2) NOT NULL,
    data_pedido DATE NOT NULL
);

CREATE TABLE pedido_cliente (
    id VARCHAR(36) PRIMARY KEY,
    cliente_id VARCHAR(36) NOT NULL,
    metodo_pagamento VARCHAR(50) NOT NULL,

    FOREIGN KEY (id) REFERENCES pedido(id),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

CREATE TABLE pedido_loja (
    id VARCHAR(36) PRIMARY KEY,
    cartao VARCHAR(50) NOT NULL,

    FOREIGN KEY (id) REFERENCES pedido(id)
);

CREATE TABLE item_pedido (
    id VARCHAR(36) PRIMARY KEY,
    pedido_id VARCHAR(36) NOT NULL,
    produto_id VARCHAR(36) NOT NULL,
    quantidade_comprada INT NOT NULL,
    preco_unitario_no_momento DECIMAL(10, 2) NOT NULL,

    FOREIGN KEY (pedido_id) REFERENCES pedido(id),
    FOREIGN KEY (produto_id) REFERENCES produto(id)
);

CREATE TABLE parcela (
    id VARCHAR(36) PRIMARY KEY,
    pedido_id VARCHAR(36) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE, -- Pode ser nulo, pois só é preenchido quando pago
    valor_parcela DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,

    FOREIGN KEY (pedido_id) REFERENCES pedido(id)
);

ALTER TABLE produto ADD COLUMN preco_venda DECIMAL(10, 2) NOT NULL DEFAULT 0.0;
ALTER TABLE produto ALTER COLUMN preco_venda DROP DEFAULT;

ALTER TABLE produto ADD COLUMN tamanho VARCHAR(50) NOT NULL;

 CREATE TABLE movimentacao_caixa (
	id VARCHAR(36) PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    tipo_movimentacao VARCHAR(50) NOT NULL,
    data_movimentacao DATE NOT NULL
);