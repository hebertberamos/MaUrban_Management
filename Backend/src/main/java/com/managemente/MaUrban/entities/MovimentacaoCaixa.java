package com.managemente.MaUrban.entities;

import com.managemente.MaUrban.entities.enums.TipoMovimentacao;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "movimentacao_caixa")
@Getter
@Setter
@NoArgsConstructor
public class MovimentacaoCaixa {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(name = "descricao", nullable = false)
    private String descricao; // Ex: "Venda #104" ou "Compra de Embalagens"

    @Column(name = "valor", nullable = false)
    private double valor;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimentacao",nullable = false)
    private TipoMovimentacao tipoMovimentacao; // ENTRADA ou SAIDA

    @Column(name = "data_movimentacao", nullable = false)
    private LocalDateTime dataMovimentacao;

}
