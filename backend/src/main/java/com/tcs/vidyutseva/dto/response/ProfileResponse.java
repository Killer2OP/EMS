package com.tcs.vidyutseva.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private String role;
    private Long consumerId;
}
