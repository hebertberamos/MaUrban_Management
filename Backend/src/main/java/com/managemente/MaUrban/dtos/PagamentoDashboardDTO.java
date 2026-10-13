package com.managemente.MaUrban.dtos;

import java.util.UUID;

public record PagamentoDashboardDTO(
        UUID idParcela,
        String nomeCliente,
        double valor,
        String status
) {}
