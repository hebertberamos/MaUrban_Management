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
}
