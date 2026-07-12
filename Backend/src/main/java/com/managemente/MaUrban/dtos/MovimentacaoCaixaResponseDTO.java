package com.managemente.MaUrban.dtos;

import com.managemente.MaUrban.entities.enums.TipoMovimentacao;

import java.time.LocalDate;
import java.util.UUID;

public record MovimentacaoCaixaResponseDTO(
        UUID id,
        String descricao,
        double valor,
        TipoMovimentacao tipoMovimentacao,
        LocalDate dataMovimentacao
) {
}
