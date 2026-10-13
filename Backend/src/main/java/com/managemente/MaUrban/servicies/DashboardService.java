package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.DebitoMensalDTO;
import com.managemente.MaUrban.dtos.PagamentoDashboardDTO;
import com.managemente.MaUrban.dtos.ResumoDashboardDTO;
import com.managemente.MaUrban.entities.Parcela;
import com.managemente.MaUrban.entities.PedidoCliente;
import com.managemente.MaUrban.entities.PedidoLoja;
import com.managemente.MaUrban.entities.enums.Cartao;
import com.managemente.MaUrban.entities.enums.StatusPagamento;
import com.managemente.MaUrban.repositories.MovimentacaoCaixaRepository;
import com.managemente.MaUrban.repositories.PedidoClienteRepository;
import com.managemente.MaUrban.repositories.PedidoLojaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PedidoClienteRepository pedidoClienteRepository;
    private final PedidoLojaRepository pedidoLojaRepository;
    private final MovimentacaoCaixaRepository movimentacaoCaixaRepository;

    @Transactional(readOnly = true)
    public ResumoDashboardDTO obterResumo(int ano, int mes) {
        double receber = pedidoClienteRepository.somarTotalAReceber(ano, mes);
        double recebido = calcularTotalRecebidoNoMes(ano, mes);
        double pagar = pedidoLojaRepository.somarTotalAPagar(ano, mes);
        double saldoCaixa = movimentacaoCaixaRepository.obterSaldoAtual();

        return new ResumoDashboardDTO(receber, pagar, recebido, saldoCaixa);
    }

    @Transactional(readOnly = true)
    public List<PagamentoDashboardDTO> listarPagamentosClientesMensal(int ano, int mes) {
        List<PagamentoDashboardDTO> pagamentos = new ArrayList<>();

        List<PedidoCliente> pedidos = pedidoClienteRepository.findPedidosComParcelasNoMes(ano, mes);
        for (PedidoCliente pedido : pedidos) {
            for (var parcela : pedido.getParcelas()) {
                // Filtra apenas as parcelas que vencem no mês requisitado
                if (parcela.getDataVencimento().getYear() == ano && parcela.getDataVencimento().getMonthValue() == mes) {
                    pagamentos.add(new PagamentoDashboardDTO(
                            parcela.getId(),
                            pedido.getCliente().getNome(),
                            parcela.getValorParcela(),
                            parcela.getStatus().name() // Ex: "PAGO" ou "PENDENTE"
                    ));
                }
            }
        }

        List<PedidoCliente> pedidosAVista = pedidoClienteRepository.findPedidosAVistaNoMes(ano, mes);
        for (PedidoCliente pedido : pedidosAVista) {
            pagamentos.add(new PagamentoDashboardDTO(
                    pedido.getId(),                // Como não há parcela, usamos o ID do próprio pedido
                    pedido.getCliente().getNome(), // Nome do cliente
                    pedido.getValorTotalPedido(),        // Valor total recebido à vista
                    "PAGO"                         // Como caiu direto na conta, o status é sempre PAGO
            ));
        }

        return pagamentos;
    }

    public List<DebitoMensalDTO> obterDebitosMensais(int mes, int ano) {
        List<PedidoLoja> pedidos = pedidoLojaRepository.findPedidosComParcelasNoMesEAno(mes, ano);

        // Agrupa todas as parcelas válidas por Cartão
        Map<Cartao, List<Parcela>> parcelasPorCartao = new HashMap<>();

        for (PedidoLoja pedido : pedidos) {
            Cartao cartao = pedido.getCartao();

            // Filtra as parcelas do pedido para garantir que são apenas as do mês/ano consultado
            List<Parcela> parcelasDoMes = pedido.getParcelas().stream()
                    .filter(p -> p.getDataVencimento().getMonthValue() == mes &&
                            p.getDataVencimento().getYear() == ano)
                    .collect(Collectors.toList());

            parcelasPorCartao.computeIfAbsent(cartao, k -> new ArrayList<>()).addAll(parcelasDoMes);
        }

        List<DebitoMensalDTO> debitos = new ArrayList<>();

        // Monta o DTO final somando os valores e validando o status
        for (Map.Entry<Cartao, List<Parcela>> entry : parcelasPorCartao.entrySet()) {
            Cartao cartao = entry.getKey();
            List<Parcela> parcelas = entry.getValue();

            if (parcelas.isEmpty()) continue; // Se não houver parcela, não exibe o cartão

            double valorTotal = parcelas.stream().mapToDouble(Parcela::getValorParcela).sum();

            // O cartão só está "pago" no mês se TODAS as parcelas do mês estiverem pagas
            boolean todosPagos = parcelas.stream().allMatch(p -> p.getStatus() == StatusPagamento.PAGO);

            // Transforma o Enum de cartão em uma String amigável (ex: C6_BANK -> "C6")
            String nomeCartao = formatarNomeCartao(cartao.name());

            debitos.add(new DebitoMensalDTO(nomeCartao, valorTotal, todosPagos));
        }

        return debitos;
    }

    private Double calcularTotalRecebidoNoMes(int ano, int mes) {
        Double totalParcelas = pedidoClienteRepository.somarParcelasPagasNoMes(ano, mes);
        Double totalAVista = pedidoClienteRepository.somarPagamentosAVistaNoMes(ano, mes);

        return totalParcelas + totalAVista;
    }

    private String formatarNomeCartao(String nome) {
        // Substitua de acordo com os Enums que você possui para ficar igual à imagem
        if (nome.contains("C6")) return "C6";
        if (nome.contains("NUBANK")) return "Nubank";
        if (nome.contains("PICPAY")) return "PicPay";
        return nome;
    }
}