package com.chamodi.weekly_report_backend.dto;

import java.util.List;

public record DashboardResponse(
        long totalReportsSubmitted,
        double submissionComplianceRate,
        long openBlockers,
        List<SubmissionStatusResponse> submissionStatuses,
        List<TaskTrendResponse> tasksCompletedTrend,
        List<ProjectDistributionResponse> workloadByProject,
        List<ReportResponse> recentReports
) {
}
