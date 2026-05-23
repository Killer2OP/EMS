package com.tcs.vidyutseva.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class InvoiceResponse {
    private Long id;
    private Long paymentId;
    private String invoiceNumber;
    private String generatedAt;
}
