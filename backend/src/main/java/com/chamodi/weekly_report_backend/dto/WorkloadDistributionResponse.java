package com.chamodi.weekly_report_backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WorkloadDistributionResponse {
    private String projectName;
    private long reportCount;
    private double totalHours;
}