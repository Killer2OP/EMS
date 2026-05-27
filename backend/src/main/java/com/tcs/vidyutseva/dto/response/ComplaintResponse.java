package com.tcs.vidyutseva.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class ComplaintResponse {
    private Long id;
    private Long consumerId;
    private String consumerName;
    private String description;
    private String category;
    private String status;
    private Long assignedSmeId;
    private String assignedSmeName;
    private boolean loggedByAdmin;
    private String createdAt;
    private String resolvedAt;
    private String resolutionNotes;
}
