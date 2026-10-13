package com.managemente.MaUrban.repositories;


import com.managemente.MaUrban.entities.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DespesaRepository extends JpaRepository<Despesa, UUID> {

}
