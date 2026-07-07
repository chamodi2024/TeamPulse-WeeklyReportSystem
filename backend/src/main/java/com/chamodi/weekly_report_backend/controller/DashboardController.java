package com.chamodi.weekly_report_backend.controller;



import com.chamodi.weekly_report_backend.dto.*;
import com.chamodi.weekly_report_backend.model.WeeklyReport;
import com.chamodi.weekly_report_backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekEnd) {
        return ResponseEntity.ok(dashboardService.getSummary(weekStart, weekEnd));
    }

    @GetMapping("/submission-status")
    public ResponseEntity<List<SubmissionStatusResponse>> getSubmissionStatus(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekEnd) {
        return ResponseEntity.ok(dashboardService.getSubmissionStatus(weekStart, weekEnd));
    }

    @GetMapping("/task-trend")
    public ResponseEntity<List<TaskTrendResponse>> getTaskTrend() {
        return ResponseEntity.ok(dashboardService.getTaskTrend());
    }

    @GetMapping("/workload-distribution")
    public ResponseEntity<List<WorkloadDistributionResponse>> getWorkloadDistribution() {
        return ResponseEntity.ok(dashboardService.getWorkloadDistribution());
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<List<WeeklyReport>> getRecentActivity() {
        return ResponseEntity.ok(dashboardService.getRecentActivity());
    }
}