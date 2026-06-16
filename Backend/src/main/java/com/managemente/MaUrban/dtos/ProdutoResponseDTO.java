package com.managemente.MaUrban.dtos;

import java.util.UUID;

public record ProdutoResponseDTO(UUID id, String nome, double precoAtual, int quantEstoque) {
}
