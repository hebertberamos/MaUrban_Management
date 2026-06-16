package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.ParcelaResponseDTO;
import com.managemente.MaUrban.entities.Parcela;
import com.managemente.MaUrban.entities.enums.StatusPagamento;
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

    @Transactional
    public ParcelaResponseDTO pagarParcela(UUID id) {
        Parcela parcela = parcelaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parcela não encontrada"));

        if (parcela.getStatus() == StatusPagamento.PAGO) {
            throw new RuntimeException("Esta parcela já foi paga.");
        }

        parcela.setStatus(StatusPagamento.PAGO);
        parcela.setDataPagamento(LocalDate.now());

        parcela = parcelaRepository.save(parcela);

        return new ParcelaResponseDTO(
                parcela.getId(),
                parcela.getDataVencimento(),
                parcela.getDataPagamento(),
                parcela.getValorParcela(),
                parcela.getStatus()
        );
    }
}
