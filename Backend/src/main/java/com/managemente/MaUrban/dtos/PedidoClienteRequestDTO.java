package com.managemente.MaUrban.dtos;

import com.managemente.MaUrban.entities.enums.MetodoPagamento;

import java.util.List;
import java.util.UUID;

public record PedidoClienteRequestDTO(UUID clienteId,
                                      MetodoPagamento metodoPagamento,
                                      List<ItemPedidoRequestDTO> itens,
                                      int quantidadeDeParcelas) {
}
