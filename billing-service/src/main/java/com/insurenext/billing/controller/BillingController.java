package com.insurenext.billing.controller;

import com.insurenext.billing.entity.Invoice;
import com.insurenext.billing.service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<Invoice>> myInvoices(Authentication auth) {
        return ResponseEntity.ok(billingService.getInvoicesForOwner(auth.getName()));
    }

    @PostMapping("/invoices/{id}/pay")
    public ResponseEntity<Invoice> pay(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(billingService.markAsPaid(id, auth.getName()));
    }
}
