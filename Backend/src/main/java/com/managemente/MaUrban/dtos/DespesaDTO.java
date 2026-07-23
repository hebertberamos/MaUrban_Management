package com.managemente.MaUrban.dtos;

import java.time.LocalDate;
import java.util.UUID;

public record DespesaDTO(
        String descricao,
        LocalDate data,
        double valor
) {}
