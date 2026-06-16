package com.managemente.MaUrban.repositories;

import com.managemente.MaUrban.entities.Parcela;
import com.managemente.MaUrban.entities.enums.StatusPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ParcelaRepository extends JpaRepository<Parcela, UUID> {

    // Exemplo: Busca todas as parcelas de um pedido específico
    List<Parcela> findByPedidoId(UUID pedidoId);

    // Exemplo: Busca as contas a receber/pagar que vencem até uma determinada data e estão pendentes
    List<Parcela> findByDataVencimentoBeforeAndStatus(LocalDate data, StatusPagamento status);

    // Exemplo: Busca todos os clientes inadimplentes (parcelas atrasadas)
    List<Parcela> findByStatus(StatusPagamento status);
}
