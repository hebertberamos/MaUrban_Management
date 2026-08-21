package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.PedidoClienteRequestDTO;
import com.managemente.MaUrban.dtos.PedidoResponseDTO;
import com.managemente.MaUrban.entities.*;
import com.managemente.MaUrban.entities.enums.MetodoPagamento;
import com.managemente.MaUrban.entities.enums.StatusPagamento;
import com.managemente.MaUrban.entities.enums.TipoMovimentacao;
import com.managemente.MaUrban.repositories.ClienteRepository;
import com.managemente.MaUrban.repositories.PedidoClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PedidoClienteService {

    private final PedidoClienteRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final MovimentacaoCaixaService movimentacaoCaixaService;

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        PedidoCliente pedido = new PedidoCliente();
        pedido.setCliente(cliente);
        pedido.setMetodoPagamento(dto.metodoPagamento());
        pedido.setDataPedido(LocalDate.now());
        pedido.setValorTotalPedido(dto.valorTotal());

        // TODO:Instead of create installments of the purchase, will be created a new 'promissoria' entity that will be saved for this client
        if (pedido.getMetodoPagamento() == MetodoPagamento.PROMISSORIA) {
            if(dto.quantidadeDeParcelas() == null) {
                //TODO: create an specific exception for this case.
                throw new RuntimeException("Compras na promissória necessitam informar quantidade de parcelas.");
            }
            pedido.setParcelas(gerarParcelas(pedido, dto.quantidadeDeParcelas()));
        } else {
            movimentacaoCaixaService.registrarMovimentacao(
                    String.format("Recebimento à vista - Cliente %s", pedido.getIdentificadorOrigem()),
                    pedido.getValorTotalPedido(),
                    TipoMovimentacao.ENTRADA
            );
        }

        pedido = pedidoRepository.save(pedido);
        return mapToResponseDTO(pedido);
    }

    @Transactional
    public PedidoResponseDTO atualizarPedido(UUID pedidoId, PedidoClienteRequestDTO dto) {
        PedidoCliente pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        pedido.getParcelas().clear();

        pedido.setMetodoPagamento(dto.metodoPagamento());
        pedido.setValorTotalPedido(dto.valorTotal());

        if (pedido.getMetodoPagamento() == MetodoPagamento.PROMISSORIA) {
            pedido.getParcelas().addAll(gerarParcelas(pedido, dto.quantidadeDeParcelas()));
        }

        pedido = pedidoRepository.save(pedido);
        return mapToResponseDTO(pedido);
    }

    private List<Parcela> gerarParcelas(PedidoCliente pedido, int quantidadeDeParcelas) {
        List<Parcela> parcelas = new ArrayList<>();
        double valorDaParcela = pedido.getValorTotalPedido() / quantidadeDeParcelas;

        for (int i = 1; i <= quantidadeDeParcelas; i++) {
            Parcela parcela = new Parcela();
            parcela.setPedido(pedido);
            parcela.setValorParcela(valorDaParcela);
            parcela.setDataVencimento(LocalDate.now().plusMonths(i));

            if (pedido.getMetodoPagamento() == MetodoPagamento.PIX
                    || pedido.getMetodoPagamento() == MetodoPagamento.DINHEIRO
                    || pedido.getMetodoPagamento() == MetodoPagamento.CARTAO) {
                parcela.setStatus(StatusPagamento.PAGO);
                parcela.setDataPagamento(LocalDate.now());
            } else {
                parcela.setStatus(StatusPagamento.PENDENTE);
            }
            parcelas.add(parcela);
        }
        return parcelas;
    }

    @Transactional
    public void deletarPedido(UUID id) {
        PedidoCliente pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (pedido.getMetodoPagamento() != MetodoPagamento.PROMISSORIA) {
            movimentacaoCaixaService.registrarMovimentacao(
                    String.format("Reembolso compra a vista - Cliente %s", pedido.getIdentificadorOrigem()),
                    pedido.getValorTotalPedido(),
                    TipoMovimentacao.SAIDA
            );
        }

        pedidoRepository.delete(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPorMes(int ano, int mes) {
        return pedidoRepository.findByMesEAno(ano, mes).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPorCliente(UUID clienteId) {
        return pedidoRepository.findByClienteId(clienteId).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    private PedidoResponseDTO mapToResponseDTO(PedidoCliente pedido) {
        return new PedidoResponseDTO(
                pedido.getId(),
                pedido.getCliente().getNome(),
                pedido.getValorTotalPedido(),
                pedido.getDataPedido(),
                pedido.getMetodoPagamento(),
                pedido.isEmAberto(pedido.getMetodoPagamento())
        );
    }
}