package com.managemente.MaUrban.controllers;

import com.managemente.MaUrban.dtos.MovimentacaoCaixaResponseDTO;
import com.managemente.MaUrban.entities.enums.TipoMovimentacao;
import com.managemente.MaUrban.servicies.MovimentacaoCaixaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimentacoes")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MovimentacaoCaixaController {

    private final MovimentacaoCaixaService service;

    @GetMapping
    public ResponseEntity<List<MovimentacaoCaixaResponseDTO>> listarPorMesEAno(
            @RequestParam int ano,
            @RequestParam int mes,
            @RequestParam(required = false) String tipo
    ) {
        TipoMovimentacao tipoEnum = null;
        if (tipo != null && !tipo.isBlank()) {
            try {
                tipoEnum = TipoMovimentacao.valueOf(tipo.toUpperCase());
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().build();
            }
        }

        List<MovimentacaoCaixaResponseDTO> lista = service.listarPorMesEAno(ano, mes, tipoEnum);
        return ResponseEntity.ok(lista);
    }

}
