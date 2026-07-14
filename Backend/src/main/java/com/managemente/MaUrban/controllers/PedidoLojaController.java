package com.managemente.MaUrban.controllers;

import com.managemente.MaUrban.dtos.PedidoLojaRequestDTO;
import com.managemente.MaUrban.dtos.PedidoLojaResponseDTO;
import com.managemente.MaUrban.servicies.PedidoLojaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos/loja")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PedidoLojaController {

    private final PedidoLojaService pedidoService;

    @GetMapping
    public ResponseEntity<List<PedidoLojaResponseDTO>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<PedidoLojaResponseDTO> criarCompra(@RequestBody PedidoLojaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.criarPedido(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoLojaResponseDTO> atualizar(@PathVariable UUID id, @RequestBody PedidoLojaRequestDTO dto) {
        return ResponseEntity.ok(pedidoService.atualizarPedido(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        pedidoService.deletarPedido(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mes")
    public ResponseEntity<List<PedidoLojaResponseDTO>> listarPorMes(@RequestParam int ano, @RequestParam int mes) {
        return ResponseEntity.ok(pedidoService.listarPorMes(ano, mes));
    }
}
