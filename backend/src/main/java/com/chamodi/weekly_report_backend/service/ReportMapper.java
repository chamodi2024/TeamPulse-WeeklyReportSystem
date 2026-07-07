package com.chamodi.weekly_report_backend.service;

import com.chamodi.weekly_report_backend.dto.ReportResponse;
import com.chamodi.weekly_report_backend.dto.UserSummary;
import com.chamodi.weekly_report_backend.model.User;
import com.chamodi.weekly_report_backend.model.WeeklyReport;
import org.springframework.stereotype.Component;

@Component
public class ReportMapper {
    private final ProjectMapper projectMapper;

    public ReportMapper(ProjectMapper projectMapper) {
        this.projectMapper = projectMapper;
    }

    public ReportResponse toResponse(WeeklyReport report) {
        User user = report.getUser();
        return new ReportResponse(
                report.getId(),
                report.getWeekStart(),
                report.getWeekEnd(),
                new UserSummary(user.getId(), user.getFullName(), user.getEmail(), user.getRole()),
                projectMapper.toResponse(report.getProject()),
                report.getTasksCompleted(),
                report.getTasksPlannedNextWeek(),
                report.getBlockers(),
                report.getHoursWorked(),
                report.getNotesOrLinks(),
                report.getStatus(),
                report.getSubmittedAt(),
                report.getCreatedAt(),
                report.getUpdatedAt()
        );
    }
}
