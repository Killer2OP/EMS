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

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import com.tcs.vidyutseva.exception.UnauthorizedRoleException;

@RestController
@RequestMapping("/api/consumers")
@RequiredArgsConstructor
public class ConsumerController {
    private final ConsumerService consumerService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ConsumerResponse>> getAllConsumers() {
        return ResponseEntity.ok(consumerService.getAllConsumers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsumerResponse> getConsumerById(@PathVariable Long id) {
        ConsumerResponse consumer = consumerService.getConsumerById(id);
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin && (consumer.getLinkedUsername() == null || !consumer.getLinkedUsername().equals(auth.getName()))) {
            throw new UnauthorizedRoleException("You are not authorized to view this consumer's data");
        }
        
        return ResponseEntity.ok(consumer);
    }

    @GetMapping("/number/{consumerNumber}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ConsumerResponse> getConsumerByNumber(@PathVariable String consumerNumber) {
        return ResponseEntity.ok(consumerService.getConsumerByNumber(consumerNumber));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ConsumerResponse> addConsumer(@Valid @RequestBody AddConsumerRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(consumerService.addConsumer(req));
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ConsumerResponse>> searchConsumers(@RequestParam String query) {
        return ResponseEntity.ok(consumerService.searchConsumers(query));
    }
}
