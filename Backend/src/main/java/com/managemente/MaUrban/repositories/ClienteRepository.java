package com.managemente.MaUrban.repositories;

import com.managemente.MaUrban.entities.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    List<Cliente> findByNomeContainingIgnoreCase(String nome);
}
