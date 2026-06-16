package com.managemente.MaUrban.entities;

import com.managemente.MaUrban.entities.enums.StatusPagamento;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pedido")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public abstract class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(name = "valor_total_pedido", nullable = false)
    private double valorTotalPedido;

    @Column(name = "data_pedido", nullable = false)
    private LocalDate dataPedido;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> pecas = new ArrayList<>();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Parcela> parcelas = new ArrayList<>();


    @Transient
    public double getValorJaPago() {
        return parcelas.stream()
                .filter(p -> p.getStatus() == StatusPagamento.PAGO)
                .mapToDouble(Parcela::getValorParcela)
                .sum();
    }

    @Transient
    public boolean isEmAberto() {
        return getValorJaPago() < valorTotalPedido;
    }

}
