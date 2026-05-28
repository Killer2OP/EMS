package com.tcs.vidyutseva.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class GenerateBillRequest {
    @NotNull(message = "Consumer ID is required") private Long consumerId;
    @NotBlank @Pattern(regexp = "^\\d{4}-(0[1-9]|1[0-2])$", message = "Period must be YYYY-MM") private String billingPeriod;
    @NotNull(message = "Units consumed is required") @Positive(message = "Units consumed must be positive") private Double unitsConsumed;
}
