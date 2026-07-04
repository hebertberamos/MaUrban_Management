package com.managemente.MaUrban.dtos;

// ClienteResumoDTO.java
import java.util.UUID;

public record ClienteResumoDTO(
        UUID id,
        String nome,
        Double valorTotalDebito
) {}
