package com.managemente.MaUrban.dtos;

import java.util.UUID;

public record ClienteResumoDTO(
        UUID id,
        String nome,
        Double valorTotalDebito
) {}
