package com.managemente.MaUrban.controllers;

import com.managemente.MaUrban.dtos.ParcelaResponseDTO;
import com.managemente.MaUrban.servicies.ParcelaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/parcelas")
@RequiredArgsConstructor
public class ParcelaController {

    private final ParcelaService parcelaService;

    @PutMapping("pagar/parcela-cliente/{id}")
    public ResponseEntity<ParcelaResponseDTO> registrarPagamentoParcelaCliente(@PathVariable UUID id) {
        ParcelaResponseDTO response = parcelaService.pagamentoParcelaCliente(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("pagar/parcela-loja/{id}")
    public ResponseEntity<ParcelaResponseDTO> registrarPagamentoParcelaLoja(@PathVariable UUID id) {
        ParcelaResponseDTO response = parcelaService.pagamentoContaLoja(id);
        return ResponseEntity.ok(response);
    }
}
