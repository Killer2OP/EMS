package com.tcs.vidyutseva.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResolveComplaintRequest {
    @NotBlank(message = "Resolution notes are required") @jakarta.validation.constraints.Size(min = 10, message = "Resolution notes must be at least 10 characters") private String resolutionNotes;
}
