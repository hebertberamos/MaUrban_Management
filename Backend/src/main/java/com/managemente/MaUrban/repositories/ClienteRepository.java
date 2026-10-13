package com.managemente.MaUrban.repositories;

import com.managemente.MaUrban.dtos.ClienteResumoDTO;
import com.managemente.MaUrban.entities.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
            COALESCE(SUM(pa.valorParcela), 0.0)
        ) 
        FROM Cliente c 
        LEFT JOIN c.pedidos p 
        LEFT JOIN p.parcelas pa ON pa.status != 'PAGO' 
        GROUP BY c.id, c.nome
        ORDER BY c.nome ASC
    """)
    List<ClienteResumoDTO> findTodosClientesComResumoDebito();
}
