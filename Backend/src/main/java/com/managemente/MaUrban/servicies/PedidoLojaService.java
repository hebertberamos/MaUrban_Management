package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.PedidoLojaRequestDTO;
import com.managemente.MaUrban.dtos.PedidoLojaResponseDTO;
import com.managemente.MaUrban.entities.Parcela;
import com.managemente.MaUrban.entities.PedidoLoja;
import com.managemente.MaUrban.entities.enums.MetodoPagamento;
import com.managemente.MaUrban.entities.enums.StatusPagamento;
import com.managemente.MaUrban.repositories.PedidoLojaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PedidoLojaService {

    private final PedidoLojaRepository pedidoRepository;
    private final ParcelaService parcelaService;

    @Transactional
    public List<PedidoLojaResponseDTO> listarTodos() {
        return pedidoRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Transactional
    public PedidoLojaResponseDTO criarPedido(PedidoLojaRequestDTO dto) {
        validarPedido(dto);

        PedidoLoja pedido = new PedidoLoja();
        pedido.setCartao(dto.cartao());
        LocalDate dataPedido = dto.dataPedido() != null ? dto.dataPedido() : LocalDate.now();
        pedido.setDataPedido(dataPedido);
        pedido.setValorTotalPedido(dto.valorTotal());
        pedido.setParcelas(gerarParcelasLoja(
                pedido,
                dto.quantidadeDeParcelas(),
                obterPrimeiroVencimento(dto, dataPedido),
                dto.quantidadeDeParcelasPagas()
        ));

        pedido = pedidoRepository.save(pedido);
        return mapToResponseDTO(pedido);
    }

    @Transactional
    public PedidoLojaResponseDTO atualizarPedido(UUID id, PedidoLojaRequestDTO dto) {
        PedidoLoja pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido da loja não encontrado"));

        validarPedido(dto);
        LocalDate dataPedido = dto.dataPedido() != null ? dto.dataPedido() : LocalDate.now();

        // Limpa as parcelas que já existiam para o pedido
        pedido.getParcelas().clear();

        pedido.setCartao(dto.cartao());
        if (dto.dataPedido() != null) {
            pedido.setDataPedido(dataPedido);
        }
        pedido.setValorTotalPedido(dto.valorTotal());
        pedido.getParcelas().addAll(gerarParcelasLoja(
                pedido,
                dto.quantidadeDeParcelas(),
                obterPrimeiroVencimento(dto, dataPedido),
                dto.quantidadeDeParcelasPagas()
        ));

        pedido = pedidoRepository.save(pedido);
        return mapToResponseDTO(pedido);
    }

    @Transactional
    public void deletarPedido(UUID id) {
        PedidoLoja pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido da loja não encontrado"));

        pedidoRepository.delete(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoLojaResponseDTO> listarPorMes(int ano, int mes) {
        return pedidoRepository.findByMesEAno(ano, mes).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    private void validarPedido(PedidoLojaRequestDTO dto) {
        if (dto == null || dto.cartao() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o cartão utilizado.");
        }
        if (!Double.isFinite(dto.valorTotal()) || dto.valorTotal() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O valor total deve ser maior que zero.");
        }
        if (dto.quantidadeDeParcelas() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A quantidade de parcelas deve ser válida.");
        }
        if (dto.quantidadeDeParcelasPagas() < 0
                || dto.quantidadeDeParcelasPagas() > dto.quantidadeDeParcelas()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A quantidade de parcelas pagas deve estar entre zero e o total de parcelas.");
        }

        LocalDate dataPedido = dto.dataPedido() != null ? dto.dataPedido() : LocalDate.now();
        LocalDate primeiroVencimento = obterPrimeiroVencimento(dto, dataPedido);
        if (primeiroVencimento.isBefore(dataPedido)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O primeiro vencimento não pode ser anterior à compra.");
        }
    }

    private LocalDate obterPrimeiroVencimento(PedidoLojaRequestDTO dto, LocalDate dataPedido) {
        return dto.dataPrimeiroVencimento() != null
                ? dto.dataPrimeiroVencimento()
                : dataPedido.plusMonths(1);
    }

    private List<Parcela> gerarParcelasLoja(
            PedidoLoja pedido,
            int quantidadeDeParcelas,
            LocalDate primeiroVencimento,
            int quantidadeDeParcelasPagas
    ) {
        List<Parcela> parcelas = new ArrayList<>();
        double valorDaParcela = pedido.getValorTotalPedido() / quantidadeDeParcelas;

        for (int i = 0; i < quantidadeDeParcelas; i++) {
            Parcela parcela = new Parcela();
            parcela.setPedido(pedido);
            parcela.setValorParcela(valorDaParcela);
            parcela.setDataVencimento(primeiroVencimento.plusMonths(i));
            parcela.setStatus(i < quantidadeDeParcelasPagas ? StatusPagamento.PAGO : StatusPagamento.PENDENTE);
            parcelas.add(parcela);
        }
        return parcelas;
    }

    private PedidoLojaResponseDTO mapToResponseDTO(PedidoLoja pedido) {
        return new PedidoLojaResponseDTO(
                pedido.getId(),
                pedido.getValorTotalPedido(),
                pedido.getDataPedido(),
                pedido.getCartao(),
                pedido.isEmAberto(MetodoPagamento.PROMISSORIA),
                parcelaService.buscarPorPedido(pedido.getId())
        );
    }
}
