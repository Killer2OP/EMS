package com.tcs.vidyutseva.dto.request;

import com.tcs.vidyutseva.enums.ComplaintCategory;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RaiseComplaintRequest {
    @NotBlank @Size(min = 20, message = "Description must be at least 20 characters") private String description;
    @NotNull private ComplaintCategory category;
}
