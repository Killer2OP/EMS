package com.tcs.vidyutseva.dto.request;

import com.tcs.vidyutseva.enums.PaymentMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OfflinePaymentRequest {
    @NotNull private Long billId;
    @NotNull private Long consumerId;
    @NotNull private PaymentMode paymentMode;
}
