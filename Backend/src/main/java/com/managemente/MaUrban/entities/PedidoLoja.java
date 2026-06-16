package com.managemente.MaUrban.entities;

import com.managemente.MaUrban.entities.enums.Cartao;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pedido_loja")
@Getter
@Setter
@NoArgsConstructor
public class PedidoLoja extends Pedido {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Cartao cartao;
}
