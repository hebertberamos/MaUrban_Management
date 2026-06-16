package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.ItemPedidoRequestDTO;
import com.managemente.MaUrban.dtos.PedidoClienteRequestDTO;
import com.managemente.MaUrban.dtos.PedidoResponseDTO;
import com.managemente.MaUrban.entities.*;
import com.managemente.MaUrban.entities.enums.MetodoPagamento;
import com.managemente.MaUrban.entities.enums.StatusPagamento;
import com.managemente.MaUrban.repositories.ClienteRepository;
import com.managemente.MaUrban.repositories.PedidoClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoClienteService {

    private final PedidoClienteRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoService produtoService; // Reaproveitamos a lógica de estoque

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoClienteRequestDTO dto) {
        // 1. Busca e valida o Cliente
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        // 2. Inicializa o Pedido
        PedidoCliente pedido = new PedidoCliente();
        pedido.setCliente(cliente);
        pedido.setMetodoPagamento(dto.metodoPagamento());
        pedido.setDataPedido(LocalDate.now());

        double valorTotal = 0.0;
        List<ItemPedido> itens = new ArrayList<>();

        // 3. Processa os itens, reduz estoque e calcula totais
        for (ItemPedidoRequestDTO itemDto : dto.itens()) {
            Produto produtoAtualizado = produtoService.reduzirEstoque(itemDto.produtoId(), itemDto.quantidade());

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produtoAtualizado);
            item.setQuantidadeComprada(itemDto.quantidade());
            item.setPrecoUnitarioNoMomento(produtoAtualizado.getPrecoAtual());

            itens.add(item);
            valorTotal += (produtoAtualizado.getPrecoAtual() * itemDto.quantidade());
        }

        pedido.setPecas(itens);
        pedido.setValorTotalPedido(valorTotal);

        // 4. Gera as parcelas financeiras
        List<Parcela> parcelas = gerarParcelas(pedido, dto.quantidadeDeParcelas());
        pedido.setParcelas(parcelas);

        // 5. Salva tudo no banco (CascadeType.ALL fará o Hibernate salvar itens e parcelas automaticamente)
        pedido = pedidoRepository.save(pedido);

        return new PedidoResponseDTO(
                pedido.getId(),
                cliente.getNome(),
                pedido.getValorTotalPedido(),
                pedido.getDataPedido(),
                pedido.getMetodoPagamento(),
                pedido.isEmAberto()
        );
    }

    private List<Parcela> gerarParcelas(PedidoCliente pedido, int quantidadeDeParcelas) {
        List<Parcela> parcelas = new ArrayList<>();
        double valorDaParcela = pedido.getValorTotalPedido() / quantidadeDeParcelas;

        for (int i = 1; i <= quantidadeDeParcelas; i++) {
            Parcela parcela = new Parcela();
            parcela.setPedido(pedido);
            parcela.setValorParcela(valorDaParcela);
            parcela.setDataVencimento(LocalDate.now().plusMonths(i));

            // Se for PIX ou Dinheiro, já entra como PAGO e com data de hoje
            if (pedido.getMetodoPagamento() == MetodoPagamento.PIX || pedido.getMetodoPagamento() == MetodoPagamento.DINHEIRO) {
                parcela.setStatus(StatusPagamento.PAGO);
                parcela.setDataPagamento(LocalDate.now());
            } else {
                parcela.setStatus(StatusPagamento.PENDENTE);
            }
            parcelas.add(parcela);
        }
        return parcelas;
    }
}
