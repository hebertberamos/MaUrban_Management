package com.managemente.MaUrban.controllers;

import com.managemente.MaUrban.dtos.PedidoClienteRequestDTO;
import com.managemente.MaUrban.dtos.PedidoResponseDTO;
import com.managemente.MaUrban.servicies.PedidoClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos/cliente")
@RequiredArgsConstructor
public class PedidoClienteController {

    private final PedidoClienteService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criarVenda(@RequestBody PedidoClienteRequestDTO dto) {
        PedidoResponseDTO response = pedidoService.criarPedido(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{pedidoId}")
    public ResponseEntity<PedidoResponseDTO> atualizar(@PathVariable UUID pedidoId, @RequestBody PedidoClienteRequestDTO dto) {
        return ResponseEntity.ok(pedidoService.atualizarPedido(pedidoId, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        pedidoService.deletarPedido(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mes/{ano}/{mes}")
    public ResponseEntity<List<PedidoResponseDTO>> listarPorMes(@PathVariable int ano, @PathVariable int mes) {
        return ResponseEntity.ok(pedidoService.listarPorMes(ano, mes));
    }

    @GetMapping("/id/{clienteId}")
    public ResponseEntity<List<PedidoResponseDTO>> listarPorCliente(@PathVariable UUID clienteId) {
        return ResponseEntity.ok(pedidoService.listarPorCliente(clienteId));
    }
}