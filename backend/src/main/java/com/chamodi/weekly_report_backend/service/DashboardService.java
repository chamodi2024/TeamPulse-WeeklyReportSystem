package com.chamodi.weekly_report_backend.service;



import com.chamodi.weekly_report_backend.dto.*;
import com.chamodi.weekly_report_backend.model.ReportStatus;
import com.chamodi.weekly_report_backend.model.Role;
import com.chamodi.weekly_report_backend.model.User;
import com.chamodi.weekly_report_backend.model.WeeklyReport;
import com.chamodi.weekly_report_backend.repository.UserRepository;
import com.chamodi.weekly_report_backend.repository.WeeklyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final WeeklyReportRepository reportRepository;
    private final UserRepository userRepository;

    public DashboardSummaryResponse getSummary(LocalDate weekStart, LocalDate weekEnd) {
        long totalTeamMembers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.MEMBER)
                .count();

        long submittedCount = reportRepository.countByWeekStartAndWeekEndAndStatus(
                weekStart, weekEnd, ReportStatus.SUBMITTED);

        long totalReports = reportRepository.countByWeekStartAndWeekEnd(weekStart, weekEnd);

        long pendingCount = Math.max(totalTeamMembers - submittedCount, 0);

        double complianceRate = totalTeamMembers == 0 ? 0.0 :
                (submittedCount * 100.0) / totalTeamMembers;

        long openBlockers = reportRepository.countOpenBlockers(weekStart, weekEnd);

        return DashboardSummaryResponse.builder()
                .totalReportsThisWeek(totalReports)
                .totalTeamMembers(totalTeamMembers)
                .submittedCount(submittedCount)
                .pendingCount(pendingCount)
                .complianceRate(Math.round(complianceRate * 100.0) / 100.0)
                .openBlockersCount(openBlockers)
                .build();
    }

    public List<SubmissionStatusResponse> getSubmissionStatus(LocalDate weekStart, LocalDate weekEnd) {
        List<User> members = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.MEMBER)
                .toList();

        List<WeeklyReport> reportsThisWeek = reportRepository.findWithFilters(
                null, null, weekStart, weekEnd);

        var reportsByUser = reportsThisWeek.stream()
                .collect(Collectors.toMap(r -> r.getUser().getId(), r -> r, (a, b) -> a));

        boolean weekHasPassed = weekEnd.isBefore(LocalDate.now());

        return members.stream().map(member -> {
            WeeklyReport report = reportsByUser.get(member.getId());

            String status;
            LocalDateTime submittedAt = null;

            if (report != null && report.getStatus() == ReportStatus.SUBMITTED) {
                status = "SUBMITTED";
                submittedAt = report.getSubmittedAt();
            } else if (weekHasPassed) {
                status = "LATE";
            } else {
                status = "PENDING";
            }

            return SubmissionStatusResponse.builder()
                    .userId(member.getId())
                    .userName(member.getName())
                    .status(status)
                    .submittedAt(submittedAt)
                    .build();
        }).toList();
    }

    public List<TaskTrendResponse> getTaskTrend() {
        List<Object[]> results = reportRepository.getTaskTrend();

        return results.stream().map(row -> TaskTrendResponse.builder()
                .weekStart((LocalDate) row[0])
                .userName((String) row[1])
                .taskCount((Long) row[2])
                .build()
        ).toList();
    }

    public List<WorkloadDistributionResponse> getWorkloadDistribution() {
        List<Object[]> results = reportRepository.getWorkloadByProject();

        return results.stream().map(row -> WorkloadDistributionResponse.builder()
                .projectName((String) row[0])
                .reportCount((Long) row[1])
                .totalHours(row[2] != null ? ((Number) row[2]).doubleValue() : 0.0)
                .build()
        ).toList();
    }

    public List<WeeklyReport> getRecentActivity() {
        return reportRepository.findAll().stream()
                .filter(r -> r.getStatus() == ReportStatus.SUBMITTED)
                .sorted((a, b) -> {
                    if (a.getSubmittedAt() == null) return 1;
                    if (b.getSubmittedAt() == null) return -1;
                    return b.getSubmittedAt().compareTo(a.getSubmittedAt());
                })
                .limit(10)
                .toList();
    }
}