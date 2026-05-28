package com.tcs.vidyutseva.service;

import com.tcs.vidyutseva.config.ApplicationConstants;
import com.tcs.vidyutseva.dto.request.OfflinePaymentRequest;
import com.tcs.vidyutseva.dto.request.OnlinePaymentRequest;
import com.tcs.vidyutseva.dto.response.PaymentResponse;
import com.tcs.vidyutseva.entity.*;
import com.tcs.vidyutseva.enums.BillStatus;
import com.tcs.vidyutseva.enums.PaymentMode;
import com.tcs.vidyutseva.enums.PaymentStatus;
import com.tcs.vidyutseva.exception.ResourceNotFoundException;
import com.tcs.vidyutseva.exception.InvalidCardException;
import com.tcs.vidyutseva.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final BillRepository billRepo;
    private final InvoiceRepository invoiceRepo;
    private final UserAccountRepository userRepo;
    private final CardRepository cardRepository;

    @Transactional
    public PaymentResponse processOnlinePayment(OnlinePaymentRequest req) {
        Bill bill = billRepo.findById(req.getBillId())
            .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        if (bill.getStatus() == BillStatus.PAID)
            throw new RuntimeException("Bill is already paid");

        Card card = cardRepository.findByCardNumber(req.getCardNumber())
            .orElseThrow(() -> new InvalidCardException("Invalid card details"));

        if (!card.getCardHolderName().equalsIgnoreCase(req.getCardHolderName()) || !card.getCvv().equals(req.getCvv())) {
            throw new InvalidCardException("Invalid card details");
        }

        Payment payment = Payment.builder()
            .bill(bill)
            .consumer(bill.getConsumer())
            .amountPaid(bill.getAmountDue())
            .paymentMode(PaymentMode.ONLINE)
            .paymentStatus(PaymentStatus.SUCCESS)
            .transactionRef("TXN-" + UUID.randomUUID().toString())
            .build();

        payment = paymentRepo.save(payment);

        bill.setStatus(BillStatus.PAID);
        billRepo.save(bill);

        Invoice invoice = generateInvoice(payment);

        return PaymentResponse.builder()
            .paymentId(payment.getId())
            .status(PaymentStatus.SUCCESS.name())
            .transactionRef(payment.getTransactionRef())
            .invoiceId(invoice.getId())
            .invoiceNumber(invoice.getInvoiceNumber())
            .amountPaid(payment.getAmountPaid())
            .paidAt(payment.getPaidAt().toString())
            .build();
    }

    @Transactional
    public PaymentResponse processOfflinePayment(OfflinePaymentRequest req, Long adminUserId) {
        Bill bill = billRepo.findById(req.getBillId())
            .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        if (bill.getStatus() == BillStatus.PAID)
            throw new RuntimeException("Bill is already paid");

        UserAccount admin = userRepo.findById(adminUserId)
            .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        Payment payment = Payment.builder()
            .bill(bill)
            .consumer(bill.getConsumer())
            .amountPaid(bill.getAmountDue())
            .paymentMode(req.getPaymentMode())
            .paymentStatus(PaymentStatus.SUCCESS)
            .processedByAdmin(admin)
            .transactionRef("TXN-WALKIN-" + UUID.randomUUID().toString())
            .build();

        payment = paymentRepo.save(payment);
        bill.setStatus(BillStatus.PAID);
        billRepo.save(bill);

        Invoice invoice = generateInvoice(payment);

        return PaymentResponse.builder()
            .paymentId(payment.getId())
            .status(PaymentStatus.SUCCESS.name())
            .transactionRef(payment.getTransactionRef())
            .invoiceId(invoice.getId())
            .invoiceNumber(invoice.getInvoiceNumber())
            .amountPaid(payment.getAmountPaid())
            .paidAt(payment.getPaidAt().toString())
            .build();
    }

    public List<PaymentResponse> getPaymentsByConsumer(Long consumerId) {
        return paymentRepo.findByConsumerId(consumerId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private Invoice generateInvoice(Payment payment) {
        String invoiceNum = String.format("%s-%s-%d",
            ApplicationConstants.INVOICE_PREFIX,
            LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")),
            payment.getId());

        Invoice invoice = Invoice.builder()
            .payment(payment)
            .invoiceNumber(invoiceNum)
            .build();

        return invoiceRepo.save(invoice);
    }

    private PaymentResponse toResponse(Payment p) {
        Invoice invoice = invoiceRepo.findByPaymentId(p.getId()).orElse(null);
        return PaymentResponse.builder()
            .paymentId(p.getId())
            .status(p.getPaymentStatus().name())
            .transactionRef(p.getTransactionRef())
            .invoiceId(invoice != null ? invoice.getId() : null)
            .invoiceNumber(invoice != null ? invoice.getInvoiceNumber() : null)
            .amountPaid(p.getAmountPaid())
            .paidAt(p.getPaidAt() != null ? p.getPaidAt().toString() : null)
            .build();
    }
}
