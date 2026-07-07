package com.chamodi.weekly_report_backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardSummaryResponse {
    private long totalReportsThisWeek;
    private long totalTeamMembers;
    private long submittedCount;
    private long pendingCount;
    private double complianceRate;
    private long openBlockersCount;
}