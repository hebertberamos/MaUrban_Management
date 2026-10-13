package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.PedidoLojaRequestDTO;
import com.managemente.MaUrban.dtos.PedidoLojaResponseDTO;
import com.managemente.MaUrban.entities.Parcela;
import com.managemente.MaUrban.entities.PedidoLoja;
import com.managemente.MaUrban.entities.enums.MetodoPagamento;
import com.managemente.MaUrban.entities.enums.StatusPagamento;
import com.managemente.MaUrban.repositories.PedidoLojaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
        PedidoLoja pedido = new PedidoLoja();
        pedido.setCartao(dto.cartao());
        pedido.setDataPedido(LocalDate.now());
        pedido.setValorTotalPedido(dto.valorTotal());
        pedido.setParcelas(gerarParcelasLoja(pedido, dto.quantidadeDeParcelas()));

        pedido = pedidoRepository.save(pedido);
        return mapToResponseDTO(pedido);
    }

    @Transactional
    public PedidoLojaResponseDTO atualizarPedido(UUID id, PedidoLojaRequestDTO dto) {
        PedidoLoja pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido da loja não encontrado"));

        // Limpa as parcelas que já existiam para o pedido
        pedido.getParcelas().clear();

        pedido.setCartao(dto.cartao());
        pedido.setValorTotalPedido(dto.valorTotal());
        pedido.getParcelas().addAll(gerarParcelasLoja(pedido, dto.quantidadeDeParcelas()));

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

    private List<Parcela> gerarParcelasLoja(PedidoLoja pedido, int quantidadeDeParcelas) {
        List<Parcela> parcelas = new ArrayList<>();
        double valorDaParcela = pedido.getValorTotalPedido() / quantidadeDeParcelas;

        for (int i = 1; i <= quantidadeDeParcelas; i++) {
            Parcela parcela = new Parcela();
            parcela.setPedido(pedido);
            parcela.setValorParcela(valorDaParcela);
            parcela.setDataVencimento(LocalDate.now().plusMonths(i));
            parcela.setStatus(StatusPagamento.PENDENTE); // Sempre começa pendente para a loja pagar depois
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
