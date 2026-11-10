package com.managemente.MaUrban.repositories;

import com.managemente.MaUrban.dtos.ClienteResumoDTO;
import com.managemente.MaUrban.entities.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    List<Cliente> findByNomeContainingIgnoreCase(String nome);

    @Query("""
    SELECT new com.managemente.MaUrban.dtos.ClienteResumoDTO(
        c.id,
        c.nome,
        c.saldoInicial
        + COALESCE((SELECT SUM(p.valorTotalPedido) FROM PedidoCliente p
                    WHERE p.cliente = c AND p.metodoPagamento = 'PROMISSORIA'), 0.0)
        - COALESCE((SELECT SUM(CASE WHEN m.tipoMovimentacao = 'ENTRADA' THEN m.valor ELSE -m.valor END)
                    FROM MovimentacaoCaixa m WHERE m.cliente = c), 0.0)
    )
    FROM Cliente c
    ORDER BY c.nome ASC
""")
    List<ClienteResumoDTO> findTodosClientesComResumoDebito();

    @Query("""
    SELECT c.saldoInicial
        + COALESCE((SELECT SUM(p.valorTotalPedido) FROM PedidoCliente p
                    WHERE p.cliente = c AND p.metodoPagamento = 'PROMISSORIA'), 0.0)
        - COALESCE((SELECT SUM(CASE WHEN m.tipoMovimentacao = 'ENTRADA' THEN m.valor ELSE -m.valor END)
                    FROM MovimentacaoCaixa m WHERE m.cliente = c), 0.0)
    FROM Cliente c
    WHERE c.id = :id
""")
    Double calcularSaldo(@Param("id") UUID id);
}
