package com.chamodi.weekly_report_backend.service;

import com.chamodi.weekly_report_backend.dto.AiQuestionRequest;
import com.chamodi.weekly_report_backend.dto.AiSummaryResponse;
import com.chamodi.weekly_report_backend.model.ReportStatus;
import com.chamodi.weekly_report_backend.model.WeeklyReport;
import com.chamodi.weekly_report_backend.repository.WeeklyReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AiAssistantService {
    private final WeeklyReportRepository reportRepository;

    public AiAssistantService(WeeklyReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public AiSummaryResponse summarize(LocalDate weekStart, LocalDate weekEnd) {
        List<WeeklyReport> reports = reportRepository.findByWeekStartGreaterThanEqualAndWeekEndLessThanEqualAndStatus(
                weekStart,
                weekEnd,
                ReportStatus.SUBMITTED
        );
        List<String> highlights = reports.stream()
                .map(report -> report.getUser().getFullName() + " completed: " + firstSentence(report.getTasksCompleted()))
                .limit(8)
                .toList();
        List<String> blockers = reports.stream()
                .map(WeeklyReport::getBlockers)
                .filter(this::hasText)
                .limit(8)
                .toList();
        String answer = "Submitted reports: " + reports.size()
                + ". Active blockers: " + blockers.size()
                + ". Main work areas: " + reports.stream().map(report -> report.getProject().getName()).distinct().toList();
        return new AiSummaryResponse(answer, highlights, blockers, privacyNote());
    }

    public AiSummaryResponse answer(AiQuestionRequest request) {
        AiSummaryResponse summary = summarize(request.weekStart(), request.weekEnd());
        String answer = "Question: " + request.question() + "\n" + summary.answer()
                + "\nThis built-in assistant summarizes stored report data locally. Connect an external LLM only after adding consent, redaction, and audit logging.";
        return new AiSummaryResponse(answer, summary.highlights(), summary.blockers(), summary.privacyNote());
    }

    private String firstSentence(String value) {
        if (!hasText(value)) {
            return "";
        }
        String trimmed = value.trim();
        int end = trimmed.indexOf('.');
        return end > 0 ? trimmed.substring(0, end + 1) : trimmed;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private List<String> privacyNote() {
        return List.of(
                "Current assistant is rule-based and does not send report content to third-party APIs.",
                "If an external LLM is added, redact sensitive links/client data and restrict access to manager/admin roles."
        );
    }
}
