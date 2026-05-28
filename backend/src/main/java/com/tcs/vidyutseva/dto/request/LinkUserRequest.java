package com.tcs.vidyutseva.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LinkUserRequest {
    @NotNull(message = "User ID is required") private Long userId;
    @NotNull(message = "Consumer ID is required") private Long consumerId;
}
