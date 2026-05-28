package com.tcs.vidyutseva.dto.request;

import com.tcs.vidyutseva.enums.PaymentMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OfflinePaymentRequest {
    @NotNull(message = "Bill ID is required") private Long billId;
    @NotNull(message = "Consumer ID is required") private Long consumerId;
    @NotNull(message = "Payment mode is required") private PaymentMode paymentMode;
}
