package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.entities.MovimentacaoCaixa;
import com.managemente.MaUrban.entities.enums.TipoMovimentacao;
import com.managemente.MaUrban.repositories.MovimentacaoCaixaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MovimentacaoCaixaService {

    private final MovimentacaoCaixaRepository repository;

    @Transactional
    public void registrarMovimentacao(String descricao, double valor, TipoMovimentacao tipo) {
        MovimentacaoCaixa movimentacaoCaixa = new MovimentacaoCaixa();

        movimentacaoCaixa.setDescricao(descricao);
        movimentacaoCaixa.setValor(valor);
        movimentacaoCaixa.setTipoMovimentacao(tipo);
        movimentacaoCaixa.setDataMovimentacao(LocalDate.now());

        repository.save(movimentacaoCaixa);
    }

}
