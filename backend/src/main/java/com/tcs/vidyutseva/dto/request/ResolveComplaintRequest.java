package com.tcs.vidyutseva.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResolveComplaintRequest {
    @NotBlank private String resolutionNotes;
}
