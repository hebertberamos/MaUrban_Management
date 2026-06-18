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
public class PedidoLojaController {

    private final PedidoLojaService pedidoService;

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

    @GetMapping("/mes/{ano}/{mes}")
    public ResponseEntity<List<PedidoLojaResponseDTO>> listarPorMes(@PathVariable int ano, @PathVariable int mes) {
        return ResponseEntity.ok(pedidoService.listarPorMes(ano, mes));
    }
}
