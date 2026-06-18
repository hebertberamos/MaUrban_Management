package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.ItemPedidoRequestDTO;
import com.managemente.MaUrban.dtos.PedidoLojaRequestDTO;
import com.managemente.MaUrban.dtos.PedidoLojaResponseDTO;
import com.managemente.MaUrban.entities.ItemPedido;
import com.managemente.MaUrban.entities.Parcela;
import com.managemente.MaUrban.entities.PedidoLoja;
import com.managemente.MaUrban.entities.Produto;
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
    private final ProdutoService produtoService;

    @Transactional
    public PedidoLojaResponseDTO criarPedido(PedidoLojaRequestDTO dto) {
        PedidoLoja pedido = new PedidoLoja();
        pedido.setCartao(dto.cartao());
        pedido.setDataPedido(LocalDate.now());

        double valorTotal = 0.0;
        List<ItemPedido> itens = new ArrayList<>();

        for (ItemPedidoRequestDTO itemDto : dto.itens()) {
            // AQUI A MÁGICA MUDA: Comprar produtos AUMENTA o estoque da loja
            Produto produtoAtualizado = produtoService.restaurarEstoque(itemDto.produtoId(), itemDto.quantidade());

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
        pedido.setParcelas(gerarParcelasLoja(pedido, dto.quantidadeDeParcelas()));

        pedido = pedidoRepository.save(pedido);
        return mapToResponseDTO(pedido);
    }

    @Transactional
    public PedidoLojaResponseDTO atualizarPedido(UUID id, PedidoLojaRequestDTO dto) {
        PedidoLoja pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido da loja não encontrado"));

        // 1. Se a loja está alterando a compra, removemos o estoque que havia entrado
        pedido.getPecas().forEach(item ->
                produtoService.removerEstoque(item.getProduto().getId(), item.getQuantidadeComprada())
        );

        pedido.getPecas().clear();
        pedido.getParcelas().clear();

        pedido.setCartao(dto.cartao());
        double valorTotal = 0.0;

        // 2. Adiciona o novo estoque
        for (ItemPedidoRequestDTO itemDto : dto.itens()) {
            Produto produtoAtualizado = produtoService.restaurarEstoque(itemDto.produtoId(), itemDto.quantidade());

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produtoAtualizado);
            item.setQuantidadeComprada(itemDto.quantidade());
            item.setPrecoUnitarioNoMomento(produtoAtualizado.getPrecoAtual());

            pedido.getPecas().add(item);
            valorTotal += (produtoAtualizado.getPrecoAtual() * itemDto.quantidade());
        }

        pedido.setValorTotalPedido(valorTotal);
        pedido.getParcelas().addAll(gerarParcelasLoja(pedido, dto.quantidadeDeParcelas()));

        pedido = pedidoRepository.save(pedido);
        return mapToResponseDTO(pedido);
    }

    @Transactional
    public void deletarPedido(UUID id) {
        PedidoLoja pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido da loja não encontrado"));

        // Se a loja cancela a compra, a mercadoria não entra, então removemos do estoque
        pedido.getPecas().forEach(item ->
                produtoService.removerEstoque(item.getProduto().getId(), item.getQuantidadeComprada())
        );

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
                pedido.isEmAberto()
        );
    }
}
