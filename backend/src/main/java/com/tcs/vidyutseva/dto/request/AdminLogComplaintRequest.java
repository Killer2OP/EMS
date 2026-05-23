package com.tcs.vidyutseva.dto.request;

import com.tcs.vidyutseva.enums.ComplaintCategory;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AdminLogComplaintRequest {
    @NotNull private Long consumerId;
    @NotBlank @Size(min = 20) private String description;
    @NotNull private ComplaintCategory category;
}
