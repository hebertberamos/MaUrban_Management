package com.managemente.MaUrban.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    private String nome;

    // mappedBy indica que o relacionamento já foi mapeado pelo atributo 'cliente' na classe PedidoCliente
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<PedidoCliente> pedidos = new ArrayList<>();
}
