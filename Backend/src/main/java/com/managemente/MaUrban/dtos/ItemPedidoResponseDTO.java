package com.managemente.MaUrban.dtos;

import java.util.UUID;

public record ItemPedidoResponseDTO(
        UUID itemId,
        String nomeProduto,
        double valorProduto,
        int quantidadeComprada
) {}
