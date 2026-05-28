package com.tcs.vidyutseva.controller;

import com.tcs.vidyutseva.dto.request.GenerateBillRequest;
import com.tcs.vidyutseva.dto.response.BillResponse;
import com.tcs.vidyutseva.service.BillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {
    private final BillService billService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BillResponse>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    @GetMapping("/consumer/{consumerId}")
    public ResponseEntity<List<BillResponse>> getBills(@PathVariable Long consumerId) {
        return ResponseEntity.ok(billService.getBillsByConsumer(consumerId));
    }

    @GetMapping("/consumer/{consumerId}/history")
    public ResponseEntity<List<BillResponse>> getBillHistory(@PathVariable Long consumerId) {
        return ResponseEntity.ok(billService.getBillHistory(consumerId));
    }

    @GetMapping("/{billId}")
    public ResponseEntity<BillResponse> getBillById(@PathVariable Long billId) {
        return ResponseEntity.ok(billService.getBillById(billId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BillResponse> generateBill(@Valid @RequestBody GenerateBillRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(billService.generateBill(req));
    }

    @DeleteMapping("/{billId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBill(@PathVariable Long billId) {
        billService.deleteBill(billId);
        return ResponseEntity.noContent().build();
    }
}
