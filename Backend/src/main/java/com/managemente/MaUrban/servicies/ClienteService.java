package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.ClienteRequestDTO;
import com.managemente.MaUrban.dtos.ClienteResponseDTO;
import com.managemente.MaUrban.dtos.ClienteResumoDTO;
import com.managemente.MaUrban.dtos.PagamentoClienteRequestDTO;
import com.managemente.MaUrban.entities.Cliente;
import com.managemente.MaUrban.entities.enums.TipoMovimentacao;
import com.managemente.MaUrban.repositories.ClienteRepository;
import com.managemente.MaUrban.repositories.MovimentacaoCaixaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    // A injeção de dependência é feita automaticamente pelo @RequiredArgsConstructor do Lombok
    private final ClienteRepository clienteRepository;
    private final MovimentacaoCaixaService movimentacaoCaixaService;

    @Transactional
    public ClienteResponseDTO criarCliente(ClienteRequestDTO dto) {
        Double debito = dto.valorDebitoInicial();
        if (debito != null && debito < 0) {
            throw new RuntimeException("O débito inicial não pode ser negativo.");
        }

        Cliente cliente = new Cliente();
        cliente.setNome(dto.nome());
        cliente.setSaldoInicial(debito != null ? debito : 0.0);

        cliente = clienteRepository.save(cliente);

        return new ClienteResponseDTO(cliente.getId(), cliente.getNome());
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listarTodos() {
        return clienteRepository.findAll().stream()
                .map(cliente -> new ClienteResponseDTO(cliente.getId(), cliente.getNome()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClienteResponseDTO buscarPorId(UUID id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID: " + id));

        return new ClienteResponseDTO(cliente.getId(), cliente.getNome());
    }

    @Transactional
    public ClienteResponseDTO atualizarCliente(UUID id, ClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID: " + id));

        cliente.setNome(dto.nome());
        cliente = clienteRepository.save(cliente);

        return new ClienteResponseDTO(cliente.getId(), cliente.getNome());
    }

    @Transactional
    public void deletarCliente(UUID id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID: " + id));

        clienteRepository.delete(cliente);
    }

    public List<ClienteResumoDTO> listarClientesComDebito() {
        return clienteRepository.findTodosClientesComResumoDebito().stream()
                .map(r -> new ClienteResumoDTO(r.id(), r.nome(), arredondar(r.valorTotalDebito())))
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResumoDTO buscarResumo(UUID id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID: " + id));
        return new ClienteResumoDTO(cliente.getId(), cliente.getNome(), calcularSaldo(id));
    }

    @Transactional
    public ClienteResumoDTO registrarPagamento(UUID id, PagamentoClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o ID: " + id));

        if (dto.valor() <= 0) {
            throw new RuntimeException("O valor do pagamento deve ser maior que zero.");
        }

        double saldo = calcularSaldo(id);
        if (dto.valor() > saldo + 0.005) {
            throw new RuntimeException("O pagamento é maior que o débito atual do cliente.");
        }

        movimentacaoCaixaService.registrarMovimentacao(
                String.format("Recebimento de débito - Cliente %s", cliente.getNome()),
                dto.valor(),
                TipoMovimentacao.ENTRADA,
                cliente);

        return new ClienteResumoDTO(cliente.getId(), cliente.getNome(), calcularSaldo(id));
    }

    private double calcularSaldo(UUID id) {
        Double saldo = clienteRepository.calcularSaldo(id);
        return saldo == null ? 0.0 : arredondar(saldo);
    }

    private double arredondar(Double valor) {
        return valor == null ? 0.0 : Math.round(valor * 100.0) / 100.0;
    }
}
