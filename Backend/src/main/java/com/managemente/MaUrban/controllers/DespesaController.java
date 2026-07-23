package com.managemente.MaUrban.controllers;

import com.managemente.MaUrban.dtos.DespesaDTO;
import com.managemente.MaUrban.servicies.DespesaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/despesas")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DespesaController {

    private final DespesaService service;

    @PostMapping
    public ResponseEntity<DespesaDTO> criarDespesa(@RequestBody DespesaDTO despesa) {
        DespesaDTO response = service.save(despesa);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
