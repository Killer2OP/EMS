package com.tcs.vidyutseva.dto.request;

import com.tcs.vidyutseva.enums.TariffType;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddConsumerRequest {
    @NotBlank private String name;
    @NotBlank private String address;
    @NotBlank private String meterNumber;
    @NotBlank @Pattern(regexp = "^\\d{13}$") private String consumerNumber;
    @NotNull private TariffType tariffType;
}
