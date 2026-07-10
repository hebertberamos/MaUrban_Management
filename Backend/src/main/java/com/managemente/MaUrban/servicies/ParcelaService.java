package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.ParcelaResponseDTO;
import com.managemente.MaUrban.entities.MovimentacaoCaixa;
import com.managemente.MaUrban.entities.Parcela;
import com.managemente.MaUrban.entities.enums.StatusPagamento;
import com.managemente.MaUrban.entities.enums.TipoMovimentacao;
import com.managemente.MaUrban.repositories.MovimentacaoCaixaRepository;
import com.managemente.MaUrban.repositories.ParcelaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParcelaService {

    private final ParcelaRepository parcelaRepository;
    private final MovimentacaoCaixaService movimentacaoCaixaService;

    public ParcelaResponseDTO pagamentoParcelaCliente(UUID id) {
        return pagarParcela(id, TipoMovimentacao.ENTRADA);
    }

    public ParcelaResponseDTO pagamentoContaLoja(UUID id) {
        return pagarParcela(id, TipoMovimentacao.SAIDA);
    }

    @Transactional
    private ParcelaResponseDTO pagarParcela(UUID id, TipoMovimentacao movimentacao) {
        Parcela parcela = parcelaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parcela não encontrada"));

        if (parcela.getStatus() == StatusPagamento.PAGO) {
            throw new RuntimeException("Esta parcela já foi paga.");
        }

        parcela.setStatus(StatusPagamento.PAGO);
        parcela.setDataPagamento(LocalDate.now());

        parcela = parcelaRepository.save(parcela);

        String descricaoMovimentacao = "";
        if(movimentacao.equals(TipoMovimentacao.ENTRADA)) {
            String nome = parcela.getPedido().getIdentificadorOrigem();
            descricaoMovimentacao = String.format("Recebimento de parcela - Cliente %s", nome, parcela.getValorParcela());
        } else {
            descricaoMovimentacao = String.format("Pagamento de despesa - Parcela %s", parcela.getPedido().getIdentificadorOrigem());
        }

        movimentacaoCaixaService.registrarMovimentacao(descricaoMovimentacao, parcela.getValorParcela(), movimentacao);

        return new ParcelaResponseDTO(
                parcela.getId(),
                parcela.getDataVencimento(),
                parcela.getDataPagamento(),
                parcela.getValorParcela(),
                parcela.getStatus()
        );
    }
}
