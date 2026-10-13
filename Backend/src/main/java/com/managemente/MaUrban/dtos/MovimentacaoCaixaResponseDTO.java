package com.managemente.MaUrban.dtos;

import com.managemente.MaUrban.entities.enums.TipoMovimentacao;

import java.time.LocalDateTime;
import java.util.UUID;

public record MovimentacaoCaixaResponseDTO(
        UUID id,
        String descricao,
        double valor,
        TipoMovimentacao tipoMovimentacao,
        LocalDateTime dataMovimentacao
) {
}
