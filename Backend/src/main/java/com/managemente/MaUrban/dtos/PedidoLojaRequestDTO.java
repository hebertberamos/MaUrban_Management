package com.managemente.MaUrban.dtos;

import com.managemente.MaUrban.entities.enums.Cartao;

import java.util.List;

public record PedidoLojaRequestDTO(
        Cartao cartao,
        List<ItemPedidoRequestDTO> itens,
        int quantidadeDeParcelas
) {}
