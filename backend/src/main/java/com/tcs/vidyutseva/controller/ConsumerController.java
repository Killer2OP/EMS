package com.tcs.vidyutseva.controller;

import com.tcs.vidyutseva.dto.request.AddConsumerRequest;
import com.tcs.vidyutseva.dto.response.ConsumerResponse;
import com.tcs.vidyutseva.service.ConsumerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consumers")
@RequiredArgsConstructor
public class ConsumerController {
    private final ConsumerService consumerService;

    @GetMapping
    public ResponseEntity<List<ConsumerResponse>> getAllConsumers() {
        return ResponseEntity.ok(consumerService.getAllConsumers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsumerResponse> getConsumerById(@PathVariable Long id) {
        return ResponseEntity.ok(consumerService.getConsumerById(id));
    }

    @GetMapping("/number/{consumerNumber}")
    public ResponseEntity<ConsumerResponse> getConsumerByNumber(@PathVariable String consumerNumber) {
        return ResponseEntity.ok(consumerService.getConsumerByNumber(consumerNumber));
    }

    @PostMapping
    public ResponseEntity<ConsumerResponse> addConsumer(@Valid @RequestBody AddConsumerRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(consumerService.addConsumer(req));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ConsumerResponse>> searchConsumers(@RequestParam String query) {
        return ResponseEntity.ok(consumerService.searchConsumers(query));
    }
}
