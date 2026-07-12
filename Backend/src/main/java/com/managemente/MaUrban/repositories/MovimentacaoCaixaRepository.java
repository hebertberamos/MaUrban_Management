package com.managemente.MaUrban.repositories;

import com.managemente.MaUrban.entities.MovimentacaoCaixa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface MovimentacaoCaixaRepository extends JpaRepository<MovimentacaoCaixa, UUID> {

    @Query("SELECT COALESCE(SUM(CASE WHEN m.tipoMovimentacao = 'ENTRADA' THEN m.valor ELSE -m.valor END), 0.0) FROM MovimentacaoCaixa m")
    Double obterSaldoAtual();

    @Query("SELECT new com.managemente.MaUrban.dtos.MovimentacaoCaixaResponseDTO(m.id, m.descricao, m.valor, m.tipoMovimentacao, m.dataMovimentacao) " +
           "FROM MovimentacaoCaixa m " +
           "WHERE YEAR(m.dataMovimentacao) = :ano AND MONTH(m.dataMovimentacao) = :mes " +
           "ORDER BY m.dataMovimentacao DESC")
    java.util.List<com.managemente.MaUrban.dtos.MovimentacaoCaixaResponseDTO> findByAnoAndMes(@org.springframework.data.repository.query.Param("ano") int ano, @org.springframework.data.repository.query.Param("mes") int mes);

}
