package com.managemente.MaUrban.repositories;

import com.managemente.MaUrban.entities.MovimentacaoCaixa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface MovimentacaoCaixaRepository extends JpaRepository<MovimentacaoCaixa, UUID> {

    @Query("SELECT COALESCE(SUM(CASE WHEN m.tipoMovimentacao = 'ENTRADA' THEN m.valor ELSE -m.valor END), 0.0) FROM MovimentacaoCaixa m")
    Double obterSaldoAtual();

}
