package com.managemente.MaUrban.servicies;

import com.managemente.MaUrban.dtos.ClienteRequestDTO;
import com.managemente.MaUrban.dtos.ClienteResponseDTO;
import com.managemente.MaUrban.entities.Cliente;
import com.managemente.MaUrban.repositories.ClienteRepository;
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

    @Transactional
    public ClienteResponseDTO criarCliente(ClienteRequestDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.nome());

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
}
