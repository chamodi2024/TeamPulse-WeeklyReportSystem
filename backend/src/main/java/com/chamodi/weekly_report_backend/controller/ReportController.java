package com.chamodi.weekly_report_backend.controller;



import com.chamodi.weekly_report_backend.dto.ReportRequest;
import com.chamodi.weekly_report_backend.dto.ReportResponse;
import com.chamodi.weekly_report_backend.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PreAuthorize("hasRole('MEMBER') or hasRole('MANAGER')")
    @PostMapping
    public ResponseEntity<ReportResponse> createReport(@Valid @RequestBody ReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.createReport(request, false));
    }

    @PreAuthorize("hasRole('MEMBER') or hasRole('MANAGER')")
    @PostMapping("/submit")
    public ResponseEntity<ReportResponse> createAndSubmitReport(@Valid @RequestBody ReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.createReport(request, true));
    }

    @PreAuthorize("hasRole('MEMBER') or hasRole('MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ReportResponse> updateReport(@PathVariable Long id,
                                                       @Valid @RequestBody ReportRequest request) {
        return ResponseEntity.ok(reportService.updateReport(id, request));
    }

    @PreAuthorize("hasRole('MEMBER') or hasRole('MANAGER')")
    @PatchMapping("/{id}/submit")
    public ResponseEntity<ReportResponse> submitReport(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.submitReport(id));
    }

    @PreAuthorize("hasRole('MEMBER') or hasRole('MANAGER')")
    @GetMapping("/my")
    public ResponseEntity<List<ReportResponse>> getMyReports() {
        return ResponseEntity.ok(reportService.getMyReports());
    }

    @PreAuthorize("hasRole('MEMBER') or hasRole('MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/team")
    public ResponseEntity<List<ReportResponse>> getTeamReports(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(reportService.getAllReportsFiltered(userId, projectId, startDate, endDate));
    }
}