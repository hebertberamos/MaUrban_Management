package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.PagamentoDashboardDTO;
import com.managemente.MaUrban.dtos.ResumoDashboardDTO;
import com.managemente.MaUrban.entities.PedidoCliente;
import com.managemente.MaUrban.repositories.MovimentacaoCaixaRepository;
import com.managemente.MaUrban.repositories.PedidoClienteRepository;
import com.managemente.MaUrban.repositories.PedidoLojaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

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

    private Double calcularTotalRecebidoNoMes(int ano, int mes) {
        Double totalParcelas = pedidoClienteRepository.somarParcelasPagasNoMes(ano, mes);
        Double totalAVista = pedidoClienteRepository.somarPagamentosAVistaNoMes(ano, mes);

        return totalParcelas + totalAVista;
    }
}