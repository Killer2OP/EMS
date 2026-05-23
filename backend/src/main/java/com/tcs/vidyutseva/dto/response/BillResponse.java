package com.tcs.vidyutseva.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class BillResponse {
    private Long id;
    private Long consumerId;
    private String consumerName;
    private String consumerNumber;
    private String billingPeriod;
    private Double unitsConsumed;
    private Double amountDue;
    private String dueDate;
    private String status;
    private String generatedAt;
}
