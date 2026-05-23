package com.tcs.vidyutseva.service;

import com.tcs.vidyutseva.dto.request.AddConsumerRequest;
import com.tcs.vidyutseva.dto.response.ConsumerResponse;
import com.tcs.vidyutseva.entity.Consumer;
import com.tcs.vidyutseva.exception.ConsumerNotFoundException;
import com.tcs.vidyutseva.repository.ConsumerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsumerService {

    private final ConsumerRepository consumerRepo;

    public List<ConsumerResponse> getAllConsumers() {
        return consumerRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ConsumerResponse getConsumerById(Long id) {
        Consumer c = consumerRepo.findById(id)
            .orElseThrow(() -> new ConsumerNotFoundException("Consumer not found: " + id));
        return toResponse(c);
    }

    public ConsumerResponse getConsumerByNumber(String consumerNumber) {
        Consumer c = consumerRepo.findByConsumerNumber(consumerNumber)
            .orElseThrow(() -> new ConsumerNotFoundException("Consumer not found: " + consumerNumber));
        return toResponse(c);
    }

    public ConsumerResponse addConsumer(AddConsumerRequest req) {
        if (consumerRepo.existsByConsumerNumber(req.getConsumerNumber()))
            throw new RuntimeException("Consumer number already exists");

        Consumer c = Consumer.builder()
            .consumerNumber(req.getConsumerNumber())
            .name(req.getName())
            .address(req.getAddress())
            .meterNumber(req.getMeterNumber())
            .tariffType(req.getTariffType())
            .build();

        return toResponse(consumerRepo.save(c));
    }

    public List<ConsumerResponse> searchConsumers(String query) {
        return consumerRepo.findByNameContainingIgnoreCaseOrConsumerNumberContaining(query, query)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ConsumerResponse toResponse(Consumer c) {
        return ConsumerResponse.builder()
            .id(c.getId())
            .consumerNumber(c.getConsumerNumber())
            .name(c.getName())
            .address(c.getAddress())
            .meterNumber(c.getMeterNumber())
            .tariffType(c.getTariffType().name())
            .linkedUserId(c.getLinkedUser() != null ? c.getLinkedUser().getId() : null)
            .linkedUsername(c.getLinkedUser() != null ? c.getLinkedUser().getUsername() : null)
            .createdAt(c.getCreatedAt().toString())
            .build();
    }
}
