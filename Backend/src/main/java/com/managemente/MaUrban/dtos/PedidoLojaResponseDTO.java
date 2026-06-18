package com.managemente.MaUrban.dtos;

import com.managemente.MaUrban.entities.enums.Cartao;

import java.time.LocalDate;
import java.util.UUID;

public record PedidoLojaResponseDTO(
        UUID id,
        double valorTotal,
        LocalDate dataPedido,
        Cartao cartao,
        boolean emAberto
) {}
