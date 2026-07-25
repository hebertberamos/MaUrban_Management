package com.managemente.MaUrban.controllers;

import com.managemente.MaUrban.dtos.DebitoMensalDTO;
import com.managemente.MaUrban.dtos.PagamentoDashboardDTO;
import com.managemente.MaUrban.dtos.ResumoDashboardDTO;
import com.managemente.MaUrban.servicies.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumo")
    public ResponseEntity<ResumoDashboardDTO> obterResumo(@RequestParam int ano, @RequestParam int mes) {
        return ResponseEntity.ok(dashboardService.obterResumo(ano, mes));
    }

    @GetMapping("/pagamentos")
    public ResponseEntity<List<PagamentoDashboardDTO>> listarPagamentosMensal(@RequestParam int ano, @RequestParam int mes) {
        return ResponseEntity.ok(dashboardService.listarPagamentosClientesMensal(ano, mes));
    }

    @GetMapping("/debitos-mensais")
    public ResponseEntity<List<DebitoMensalDTO>> getDebitosMensais(
            @RequestParam int mes,
            @RequestParam int ano) {
        return ResponseEntity.ok(dashboardService.obterDebitosMensais(mes, ano));
    }
}
