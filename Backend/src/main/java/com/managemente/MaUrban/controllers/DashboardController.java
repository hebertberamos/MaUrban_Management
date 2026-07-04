package com.managemente.MaUrban.controllers;

import com.managemente.MaUrban.dtos.ParcelaDashboardDTO;
import com.managemente.MaUrban.dtos.ResumoDashboardDTO;
import com.managemente.MaUrban.servicies.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*") // Permite requisições do React
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumo")
    public ResponseEntity<ResumoDashboardDTO> obterResumo(@RequestParam int ano, @RequestParam int mes) {
        return ResponseEntity.ok(dashboardService.obterResumo(ano, mes));
    }

    @GetMapping("/pagamentos")
    public ResponseEntity<List<ParcelaDashboardDTO>> listarPagamentosMensal(@RequestParam int ano, @RequestParam int mes) {
        return ResponseEntity.ok(dashboardService.listarPagamentosClientesMensal(ano, mes));
    }
}
