package com.tcs.vidyutseva.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class AuthResponse {
    private String token;
    private String role;
    private Long userId;
    private String username;
    private Long consumerId;
}
