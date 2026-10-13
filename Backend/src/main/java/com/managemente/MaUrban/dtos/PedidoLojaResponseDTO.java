package com.managemente.MaUrban.dtos;

import com.managemente.MaUrban.entities.enums.Cartao;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PedidoLojaResponseDTO(
        UUID id,
        double valorTotal,
        LocalDate dataPedido,
        Cartao cartao,
        boolean emAberto,
        List<ParcelaResponseDTO> parcelas
) {}
