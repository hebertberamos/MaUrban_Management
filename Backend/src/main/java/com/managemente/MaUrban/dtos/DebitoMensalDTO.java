package com.managemente.MaUrban.dtos;

public record DebitoMensalDTO(
        String cartao,
        double valorTotal,
        boolean pago
) {}
