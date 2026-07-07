package com.chamodi.weekly_report_backend.service;



import com.chamodi.weekly_report_backend.dto.ReportRequest;
import com.chamodi.weekly_report_backend.dto.ReportResponse;
import com.chamodi.weekly_report_backend.model.*;
import com.chamodi.weekly_report_backend.exception.ResourceNotFoundException;
import com.chamodi.weekly_report_backend.exception.UnauthorizedActionException;
import com.chamodi.weekly_report_backend.repository.ProjectRepository;
import com.chamodi.weekly_report_backend.repository.UserRepository;
import com.chamodi.weekly_report_backend.repository.WeeklyReportRepository;
import com.chamodi.weekly_report_backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final WeeklyReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    private User getCurrentUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Logged-in user not found"));
    }

    public ReportResponse createReport(ReportRequest request, boolean submitNow) {
        User currentUser = getCurrentUser();

        Project project = null;
        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        }

        WeeklyReport report = WeeklyReport.builder()
                .user(currentUser)
                .project(project)
                .weekStart(request.getWeekStart())
                .weekEnd(request.getWeekEnd())
                .tasksCompleted(request.getTasksCompleted())
                .tasksPlanned(request.getTasksPlanned())
                .blockers(request.getBlockers())
                .hoursWorked(request.getHoursWorked())
                .notes(request.getNotes())
                .status(submitNow ? ReportStatus.SUBMITTED : ReportStatus.DRAFT)
                .submittedAt(submitNow ? LocalDateTime.now() : null)
                .build();

        reportRepository.save(report);
        return mapToResponse(report);
    }

    public ReportResponse updateReport(Long reportId, ReportRequest request) {
        User currentUser = getCurrentUser();
        WeeklyReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        if (!report.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedActionException("You can only edit your own reports");
        }

        Project project = null;
        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        }

        report.setProject(project);
        report.setWeekStart(request.getWeekStart());
        report.setWeekEnd(request.getWeekEnd());
        report.setTasksCompleted(request.getTasksCompleted());
        report.setTasksPlanned(request.getTasksPlanned());
        report.setBlockers(request.getBlockers());
        report.setHoursWorked(request.getHoursWorked());
        report.setNotes(request.getNotes());

        reportRepository.save(report);
        return mapToResponse(report);
    }

    public ReportResponse submitReport(Long reportId) {
        User currentUser = getCurrentUser();
        WeeklyReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        if (!report.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedActionException("You can only submit your own reports");
        }

        report.setStatus(ReportStatus.SUBMITTED);
        report.setSubmittedAt(LocalDateTime.now());
        reportRepository.save(report);
        return mapToResponse(report);
    }

    public List<ReportResponse> getMyReports() {
        User currentUser = getCurrentUser();
        return reportRepository.findByUserIdOrderByWeekStartDesc(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReportResponse> getAllReportsFiltered(Long userId, Long projectId,
                                                      LocalDate startDate, LocalDate endDate) {
        return reportRepository.findWithFilters(userId, projectId, startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ReportResponse getReportById(Long reportId) {
        User currentUser = getCurrentUser();
        WeeklyReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        boolean isOwner = report.getUser().getId().equals(currentUser.getId());
        boolean isManager = currentUser.getRole() == Role.MANAGER;

        if (!isOwner && !isManager) {
            throw new UnauthorizedActionException("You do not have access to this report");
        }

        return mapToResponse(report);
    }

    private ReportResponse mapToResponse(WeeklyReport report) {
        return ReportResponse.builder()
                .id(report.getId())
                .userId(report.getUser().getId())
                .userName(report.getUser().getName())
                .projectId(report.getProject() != null ? report.getProject().getId() : null)
                .projectName(report.getProject() != null ? report.getProject().getName() : null)
                .weekStart(report.getWeekStart())
                .weekEnd(report.getWeekEnd())
                .tasksCompleted(report.getTasksCompleted())
                .tasksPlanned(report.getTasksPlanned())
                .blockers(report.getBlockers())
                .hoursWorked(report.getHoursWorked())
                .notes(report.getNotes())
                .status(report.getStatus().name())
                .submittedAt(report.getSubmittedAt())
                .build();
    }
}