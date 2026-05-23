package com.tcs.vidyutseva.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LinkUserRequest {
    @NotNull private Long userId;
    @NotNull private Long consumerId;
}
