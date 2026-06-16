package com.managemente.MaUrban.controllers;

import com.managemente.MaUrban.dtos.PedidoClienteRequestDTO;
import com.managemente.MaUrban.dtos.PedidoResponseDTO;
import com.managemente.MaUrban.servicies.PedidoClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}