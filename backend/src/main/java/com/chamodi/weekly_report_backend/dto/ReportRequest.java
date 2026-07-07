package com.chamodi.weekly_report_backend.dto;



import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class ReportRequest {

    @NotNull(message = "Week start date is required")
    private LocalDate weekStart;

    @NotNull(message = "Week end date is required")
    private LocalDate weekEnd;

    private Long projectId;
    private String tasksCompleted;
    private String tasksPlanned;
    private String blockers;
    private Double hoursWorked;
    private String notes;
}
