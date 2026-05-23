package com.tcs.vidyutseva.service;

import com.tcs.vidyutseva.config.ApplicationConstants;
import com.tcs.vidyutseva.dto.request.GenerateBillRequest;
import com.tcs.vidyutseva.dto.response.BillResponse;
import com.tcs.vidyutseva.entity.Bill;
import com.tcs.vidyutseva.entity.Consumer;
import com.tcs.vidyutseva.enums.BillStatus;
import com.tcs.vidyutseva.exception.ConsumerNotFoundException;
import com.tcs.vidyutseva.exception.DuplicateBillPeriodException;
import com.tcs.vidyutseva.exception.ResourceNotFoundException;
import com.tcs.vidyutseva.repository.BillRepository;
import com.tcs.vidyutseva.repository.ConsumerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepo;
    private final ConsumerRepository consumerRepo;

    public List<BillResponse> getBillsByConsumer(Long consumerId) {
        return billRepo.findByConsumerId(consumerId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BillResponse> getBillHistory(Long consumerId) {
        return billRepo.findByConsumerIdAndStatus(consumerId, BillStatus.PAID)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BillResponse getBillById(Long billId) {
        Bill bill = billRepo.findById(billId)
            .orElseThrow(() -> new ResourceNotFoundException("Bill not found: " + billId));
        return toResponse(bill);
    }

    public List<BillResponse> getAllBills() {
        return billRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BillResponse generateBill(GenerateBillRequest req) {
        if (billRepo.existsByConsumerIdAndBillingPeriod(req.getConsumerId(), req.getBillingPeriod()))
            throw new DuplicateBillPeriodException(
                "Bill for period " + req.getBillingPeriod() + " already exists for this consumer");

        Consumer consumer = consumerRepo.findById(req.getConsumerId())
            .orElseThrow(() -> new ConsumerNotFoundException("Consumer not found"));

        double rate = switch (consumer.getTariffType()) {
            case DOMESTIC   -> ApplicationConstants.DOMESTIC_RATE;
            case COMMERCIAL -> ApplicationConstants.COMMERCIAL_RATE;
            case INDUSTRIAL -> ApplicationConstants.INDUSTRIAL_RATE;
        };

        Bill bill = Bill.builder()
            .consumer(consumer)
            .billingPeriod(req.getBillingPeriod())
            .unitsConsumed(req.getUnitsConsumed())
            .amountDue(req.getUnitsConsumed() * rate)
            .dueDate(LocalDate.now().plusDays(30))
            .status(BillStatus.UNPAID)
            .build();

        return toResponse(billRepo.save(bill));
    }

    public void deleteBill(Long billId) {
        if (!billRepo.existsById(billId))
            throw new ResourceNotFoundException("Bill not found: " + billId);
        billRepo.deleteById(billId);
    }

    private BillResponse toResponse(Bill b) {
        return BillResponse.builder()
            .id(b.getId())
            .consumerId(b.getConsumer().getId())
            .consumerName(b.getConsumer().getName())
            .consumerNumber(b.getConsumer().getConsumerNumber())
            .billingPeriod(b.getBillingPeriod())
            .unitsConsumed(b.getUnitsConsumed())
            .amountDue(b.getAmountDue())
            .dueDate(b.getDueDate().toString())
            .status(b.getStatus().name())
            .generatedAt(b.getGeneratedAt() != null ? b.getGeneratedAt().toString() : null)
            .build();
    }
}
