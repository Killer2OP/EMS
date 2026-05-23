package com.tcs.vidyutseva.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignSmeRequest {
    @NotNull private Long smeUserId;
}
