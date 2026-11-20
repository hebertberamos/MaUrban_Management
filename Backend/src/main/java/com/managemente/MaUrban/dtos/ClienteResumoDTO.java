package com.managemente.MaUrban.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record ClienteResumoDTO(
        UUID id,
        String nome,
        Double valorTotalDebito,
        LocalDateTime ultimoPagamento
) {}
