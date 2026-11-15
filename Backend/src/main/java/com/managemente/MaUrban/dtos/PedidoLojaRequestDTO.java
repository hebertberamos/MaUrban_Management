package com.managemente.MaUrban.dtos;

import com.managemente.MaUrban.entities.enums.Cartao;

import java.time.LocalDate;

public record PedidoLojaRequestDTO(
        Cartao cartao,
        double valorTotal,
        int quantidadeDeParcelas,
        LocalDate dataPedido,
        LocalDate dataPrimeiroVencimento,
        int quantidadeDeParcelasPagas
) {}
