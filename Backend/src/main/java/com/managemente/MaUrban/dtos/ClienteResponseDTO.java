package com.managemente.MaUrban.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record ClienteResponseDTO(
        UUID id,
        String nome,
        Double valorDebitoInicial,
        LocalDateTime ultimoPagamento
) {}
