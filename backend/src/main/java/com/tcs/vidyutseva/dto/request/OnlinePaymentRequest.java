package com.tcs.vidyutseva.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OnlinePaymentRequest {
    @NotNull private Long billId;
    @NotBlank @Pattern(regexp = "^\\d{16}$", message = "Card number must be 16 digits") private String cardNumber;
    @NotBlank @Pattern(regexp = "^\\d{3,4}$", message = "CVV must be 3 or 4 digits") private String cvv;
    @NotBlank private String cardHolderName;
}
