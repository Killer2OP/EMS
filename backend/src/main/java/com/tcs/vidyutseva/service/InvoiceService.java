package com.tcs.vidyutseva.service;

import com.tcs.vidyutseva.dto.response.InvoiceResponse;
import com.tcs.vidyutseva.entity.Invoice;
import com.tcs.vidyutseva.exception.ResourceNotFoundException;
import com.tcs.vidyutseva.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepo;

    public InvoiceResponse getInvoiceByPaymentId(Long paymentId) {
        Invoice invoice = invoiceRepo.findByPaymentId(paymentId)
            .orElseThrow(() -> new ResourceNotFoundException("Invoice not found for payment: " + paymentId));
        return toResponse(invoice);
    }

    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
        return toResponse(invoice);
    }

    private InvoiceResponse toResponse(Invoice inv) {
        return InvoiceResponse.builder()
            .id(inv.getId())
            .paymentId(inv.getPayment().getId())
            .invoiceNumber(inv.getInvoiceNumber())
            .generatedAt(inv.getGeneratedAt() != null ? inv.getGeneratedAt().toString() : null)
            .build();
    }
}
