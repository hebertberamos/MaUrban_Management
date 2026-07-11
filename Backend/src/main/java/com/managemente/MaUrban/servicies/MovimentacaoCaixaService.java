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

    // Novo método para listar movimentações por mês e ano com filtro opcional por tipo
    public java.util.List<com.managemente.MaUrban.dtos.MovimentacaoCaixaResponseDTO> listarPorMesEAno(int ano, int mes, TipoMovimentacao tipo) {
        var lista = repository.findByAnoAndMes(ano, mes);
        if (tipo == null) return lista;
        return lista.stream()
                .filter(m -> m.tipoMovimentacao().equals(tipo))
                .toList();
    }

}
