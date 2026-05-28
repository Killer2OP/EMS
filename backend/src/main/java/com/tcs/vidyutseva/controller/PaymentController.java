package com.tcs.vidyutseva.controller;

import com.tcs.vidyutseva.dto.request.OfflinePaymentRequest;
import com.tcs.vidyutseva.dto.request.OnlinePaymentRequest;
import com.tcs.vidyutseva.dto.response.PaymentResponse;
import com.tcs.vidyutseva.security.JwtUtil;
import com.tcs.vidyutseva.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    private final JwtUtil jwtUtil;

    @PostMapping("/online")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> processOnlinePayment(@Valid @RequestBody OnlinePaymentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.processOnlinePayment(req));
    }

    @PostMapping("/offline")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> processOfflinePayment(@Valid @RequestBody OfflinePaymentRequest req,
                                                                   HttpServletRequest httpReq) {
        Long adminId = extractUserId(httpReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.processOfflinePayment(req, adminId));
    }

    @GetMapping("/consumer/{consumerId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByConsumer(@PathVariable Long consumerId) {
        return ResponseEntity.ok(paymentService.getPaymentsByConsumer(consumerId));
    }

    private Long extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }
}
