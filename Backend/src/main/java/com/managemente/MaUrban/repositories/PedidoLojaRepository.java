package com.managemente.MaUrban.repositories;

import com.managemente.MaUrban.entities.PedidoLoja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface PedidoLojaRepository extends JpaRepository<PedidoLoja, UUID> {

}
