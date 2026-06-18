package com.managemente.MaUrban.repositories;

import com.managemente.MaUrban.entities.PedidoLoja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PedidoLojaRepository extends JpaRepository<PedidoLoja, UUID> {

    @Query("SELECT p FROM PedidoLoja p WHERE YEAR(p.dataPedido) = :ano AND MONTH(p.dataPedido) = :mes")
    List<PedidoLoja> findByMesEAno(@Param("ano") int ano, @Param("mes") int mes);

}
