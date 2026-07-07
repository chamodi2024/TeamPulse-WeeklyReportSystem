package com.chamodi.weekly_report_backend.dto;



import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class ReportResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long projectId;
    private String projectName;
    private LocalDate weekStart;
    private LocalDate weekEnd;
    private String tasksCompleted;
    private String tasksPlanned;
    private String blockers;
    private Double hoursWorked;
    private String notes;
    private String status;
    private LocalDateTime submittedAt;
}
