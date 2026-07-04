package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.ParcelaDashboardDTO;
import com.managemente.MaUrban.dtos.ResumoDashboardDTO;
import com.managemente.MaUrban.entities.PedidoCliente;
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

    @Transactional(readOnly = true)
    public ResumoDashboardDTO obterResumo(int ano, int mes) {
        double receber = pedidoClienteRepository.somarTotalAReceber(ano, mes);
        double recebido = pedidoClienteRepository.somarTotalJaRecebido(ano, mes);
        double pagar = pedidoLojaRepository.somarTotalAPagar(ano, mes);

        return new ResumoDashboardDTO(receber, pagar, recebido);
    }

    @Transactional(readOnly = true)
    public List<ParcelaDashboardDTO> listarPagamentosClientesMensal(int ano, int mes) {
        List<PedidoCliente> pedidos = pedidoClienteRepository.findPedidosComParcelasNoMes(ano, mes);
        List<ParcelaDashboardDTO> pagamentos = new ArrayList<>();

        for (PedidoCliente pedido : pedidos) {
            for (var parcela : pedido.getParcelas()) {
                // Filtra apenas as parcelas que vencem no mês requisitado
                if (parcela.getDataVencimento().getYear() == ano && parcela.getDataVencimento().getMonthValue() == mes) {
                    pagamentos.add(new ParcelaDashboardDTO(
                            parcela.getId(),
                            pedido.getCliente().getNome(),
                            parcela.getValorParcela(),
                            parcela.getStatus().name() // Ex: "PAGO" ou "PENDENTE"
                    ));
                }
            }
        }
        return pagamentos;
    }
}