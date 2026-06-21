package com.managemente.MaUrban.dtos;

import com.managemente.MaUrban.entities.enums.Tamanho;

import java.util.UUID;

public record ProdutoResponseDTO(UUID id, String nome, double precoAtual, double precoVenda, int quantEstoque, Tamanho tamanho) {
}
