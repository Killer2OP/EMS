package com.tcs.vidyutseva.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class PaymentResponse {
    private Long paymentId;
    private String status;
    private String transactionRef;
    private Long invoiceId;
    private String invoiceNumber;
    private Double amountPaid;
    private String paidAt;
}
