package com.tcs.vidyutseva.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class ApiErrorResponse {
    private int status;
    private String error;
    private String message;
    private String timestamp;
}
