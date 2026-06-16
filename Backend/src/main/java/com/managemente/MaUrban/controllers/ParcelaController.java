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

    @PutMapping("/{id}/pagar")
    public ResponseEntity<ParcelaResponseDTO> registrarPagamento(@PathVariable UUID id) {
        ParcelaResponseDTO response = parcelaService.pagarParcela(id);
        return ResponseEntity.ok(response);
    }
}
