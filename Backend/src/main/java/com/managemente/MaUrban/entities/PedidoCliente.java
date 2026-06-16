package com.managemente.MaUrban.entities;

import com.managemente.MaUrban.entities.enums.MetodoPagamento;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pedido_cliente")
@Getter
@Setter
@NoArgsConstructor
public class PedidoCliente extends Pedido {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pagamento", nullable = false)
    private MetodoPagamento metodoPagamento;
}
