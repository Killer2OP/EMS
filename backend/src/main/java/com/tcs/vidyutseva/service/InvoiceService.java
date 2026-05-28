package com.tcs.vidyutseva.service;

import com.tcs.vidyutseva.dto.response.InvoiceResponse;
import com.tcs.vidyutseva.entity.Invoice;
import com.tcs.vidyutseva.entity.Payment;
import com.tcs.vidyutseva.exception.ResourceNotFoundException;
import com.tcs.vidyutseva.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    public Invoice generateInvoice(Payment payment) {
        Invoice invoice = Invoice.builder()
            .payment(payment)
            .invoiceNumber("INV-" + System.currentTimeMillis())
            .build();
        return invoiceRepo.save(invoice);
    }

    public List<InvoiceResponse> getInvoicesByConsumer(Long consumerId) {
        return invoiceRepo.findAll().stream()
            .filter(inv -> inv.getPayment().getBill().getConsumer().getId().equals(consumerId))
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public InvoiceResponse toResponse(Invoice inv) {
        return InvoiceResponse.builder()
            .id(inv.getId())
            .paymentId(inv.getPayment().getId())
            .invoiceNumber(inv.getInvoiceNumber())
            .amountPaid(inv.getPayment().getAmountPaid())
            .transactionRef(inv.getPayment().getTransactionRef())
            .generatedAt(inv.getGeneratedAt() != null ? inv.getGeneratedAt().toString() : null)
            .build();
    }
}
