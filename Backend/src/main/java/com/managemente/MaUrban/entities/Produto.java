package com.managemente.MaUrban.entities;

import com.managemente.MaUrban.entities.enums.Tamanho;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "produto")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "preco_atual", nullable = false)
    private double precoAtual;

    @Column(name = "preco_venda", nullable = false)
    private double precoVenda;

    @Column(name = "quant_estoque", nullable = false)
    private int quantEstoque;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tamanho tamanho;

    public void calcularPrecoVenda() {
        this.precoVenda = precoAtual * 1.3;
    }
}
