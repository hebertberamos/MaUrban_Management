package com.managemente.MaUrban.repositories;

import com.managemente.MaUrban.entities.PedidoCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface PedidoClienteRepository extends JpaRepository<PedidoCliente, UUID> {

    @Query("SELECT p FROM PedidoCliente p WHERE YEAR(p.dataPedido) = :ano AND MONTH(p.dataPedido) = :mes")
    List<PedidoCliente> findByMesEAno(@Param("ano") int ano, @Param("mes") int mes);

    List<PedidoCliente> findByClienteId(UUID clienteId);

    @Query("SELECT COALESCE(SUM(pa.valorParcela), 0) FROM PedidoCliente p JOIN p.parcelas pa WHERE YEAR(pa.dataVencimento) = :ano AND MONTH(pa.dataVencimento) = :mes AND pa.status = 'PENDENTE'")
    Double somarTotalAReceber(@Param("ano") int ano, @Param("mes") int mes);

    @Query("SELECT COALESCE(SUM(pa.valorParcela), 0) FROM PedidoCliente p JOIN p.parcelas pa WHERE YEAR(pa.dataVencimento) = :ano AND MONTH(pa.dataVencimento) = :mes AND pa.status = 'PAGO'")
    Double somarParcelasPagasNoMes(@Param("ano") int ano, @Param("mes") int mes);

    @Query("SELECT COALESCE(SUM(p.valorTotalPedido), 0) FROM PedidoCliente p WHERE YEAR(p.dataPedido) = :ano AND MONTH(p.dataPedido) = :mes AND p.metodoPagamento IN ('PIX', 'DINHEIRO', 'CARTAO')")
    Double somarPagamentosAVistaNoMes(@Param("ano") int ano, @Param("mes") int mes);

    @Query("SELECT DISTINCT p FROM PedidoCliente p JOIN p.parcelas pa WHERE YEAR(pa.dataVencimento) = :ano AND MONTH(pa.dataVencimento) = :mes")
    List<PedidoCliente> findPedidosComParcelasNoMes(@Param("ano") int ano, @Param("mes") int mes);

    @Query("SELECT p FROM PedidoCliente p WHERE p.metodoPagamento IN ('PIX', 'DINHEIRO', 'CARTAO') AND YEAR(p.dataPedido) = :ano AND MONTH(p.dataPedido) = :mes")
    List<PedidoCliente> findPedidosAVistaNoMes(@Param("ano") int ano, @Param("mes") int mes);
}
