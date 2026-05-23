package com.tcs.vidyutseva.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class ConsumerResponse {
    private Long id;
    private String consumerNumber;
    private String name;
    private String address;
    private String meterNumber;
    private String tariffType;
    private Long linkedUserId;
    private String linkedUsername;
    private String createdAt;
}
