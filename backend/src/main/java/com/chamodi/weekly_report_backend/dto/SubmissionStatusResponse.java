package com.chamodi.weekly_report_backend.dto;



import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class SubmissionStatusResponse {
    private Long userId;
    private String userName;
    private String status;
    private LocalDateTime submittedAt;
}
