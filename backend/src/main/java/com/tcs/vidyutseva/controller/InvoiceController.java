package com.tcs.vidyutseva.controller;

import com.tcs.vidyutseva.dto.response.InvoiceResponse;
import com.tcs.vidyutseva.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/consumer/{consumerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByConsumer(@PathVariable Long consumerId) {
        return ResponseEntity.ok(invoiceService.getInvoicesByConsumer(consumerId));
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<InvoiceResponse> downloadInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }
}
