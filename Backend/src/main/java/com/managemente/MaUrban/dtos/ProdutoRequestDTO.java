package com.managemente.MaUrban.dtos;

import com.managemente.MaUrban.entities.enums.Tamanho;

public record ProdutoRequestDTO(String nome, double precoAtual, int quantEstoque, Tamanho tamanho) {
}
