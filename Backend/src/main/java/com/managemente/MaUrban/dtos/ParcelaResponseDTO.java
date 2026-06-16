package com.managemente.MaUrban.dtos;

import com.managemente.MaUrban.entities.enums.StatusPagamento;

import java.time.LocalDate;
import java.util.UUID;

public record ParcelaResponseDTO(UUID id,
                                 LocalDate dataVencimento,
                                 LocalDate dataPagamento,
                                 double valorParcela,
                                 StatusPagamento status) {
}
