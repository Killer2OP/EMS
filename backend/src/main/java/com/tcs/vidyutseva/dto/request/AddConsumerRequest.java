package com.tcs.vidyutseva.dto.request;

import com.tcs.vidyutseva.enums.TariffType;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddConsumerRequest {
    @NotBlank @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters") private String name;
    @NotBlank @Size(min = 5, max = 150, message = "Address must be between 5 and 150 characters") private String address;
    @NotBlank @Pattern(regexp = "^MTR-\\d{3,6}$", message = "Meter number must follow pattern MTR-XXX") private String meterNumber;
    @NotBlank @Pattern(regexp = "^\\d{13}$") private String consumerNumber;
    @NotNull private TariffType tariffType;
}
