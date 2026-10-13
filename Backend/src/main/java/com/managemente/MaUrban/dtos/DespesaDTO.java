package com.managemente.MaUrban.dtos;

import java.time.LocalDate;

public record DespesaDTO(
        String descricao,
        LocalDate data,
        double valor
) {}
