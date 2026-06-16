package com.managemente.MaUrban.dtos;

import com.managemente.MaUrban.entities.enums.MetodoPagamento;

import java.time.LocalDate;
import java.util.UUID;

public record PedidoResponseDTO(UUID id,
                                String nomeCliente,
                                double valorTotal,
                                LocalDate dataPedido,
                                MetodoPagamento metodoPagamento,
                                boolean emAberto) {
}
