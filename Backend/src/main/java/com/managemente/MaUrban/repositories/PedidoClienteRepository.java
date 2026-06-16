package com.managemente.MaUrban.repositories;

import com.managemente.MaUrban.entities.PedidoCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface PedidoClienteRepository extends JpaRepository<PedidoCliente, UUID> {

    List<PedidoCliente> findByClienteId(UUID clienteId);
}
