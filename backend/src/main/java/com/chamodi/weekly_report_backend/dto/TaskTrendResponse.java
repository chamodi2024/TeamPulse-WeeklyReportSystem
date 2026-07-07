package com.chamodi.weekly_report_backend.dto;



import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Builder
public class TaskTrendResponse {
    private LocalDate weekStart;
    private String userName;
    private long taskCount;
}
