package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.DespesaDTO;
import com.managemente.MaUrban.entities.Despesa;
import com.managemente.MaUrban.entities.enums.TipoMovimentacao;
import com.managemente.MaUrban.repositories.DespesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DespesaService {

    private final DespesaRepository repository;
    private final MovimentacaoCaixaService movimentacaoCaixaService;

    public DespesaDTO save(DespesaDTO dto) {
        Despesa despesa = new Despesa();
        despesa.setDescricao(dto.descricao());
        despesa.setData(dto.data());
        despesa.setValor(dto.valor());

        despesa = repository.save(despesa);

        movimentacaoCaixaService.registrarMovimentacao(despesa.getDescricao(), despesa.getValor(), TipoMovimentacao.SAIDA);

        return mapToDespesaDTO(despesa);
    }

    private DespesaDTO mapToDespesaDTO(Despesa despesa) {
        return new DespesaDTO(
                despesa.getDescricao(),
                despesa.getData(),
                despesa.getValor()
        );
    }
}
