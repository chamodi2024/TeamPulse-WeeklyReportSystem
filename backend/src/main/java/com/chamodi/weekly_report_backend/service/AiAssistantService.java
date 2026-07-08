package com.chamodi.weekly_report_backend.service;

import com.chamodi.weekly_report_backend.dto.AiQuestionRequest;
import com.chamodi.weekly_report_backend.dto.AiSummaryResponse;
import com.chamodi.weekly_report_backend.model.ReportStatus;
import com.chamodi.weekly_report_backend.model.WeeklyReport;
import com.chamodi.weekly_report_backend.repository.WeeklyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiAssistantService {

    private final WeeklyReportRepository reportRepository;

    public AiSummaryResponse summarize(LocalDate weekStart, LocalDate weekEnd) {
        List<WeeklyReport> reports = reportRepository.findWithFilters(null, null, weekStart, weekEnd)
                .stream()
                .filter(r -> r.getStatus() == ReportStatus.SUBMITTED)
                .toList();

        List<String> highlights = reports.stream()
                .map(r -> r.getUser().getName() + " — " + firstSentence(r.getTasksCompleted()))
                .filter(s -> !s.endsWith("— "))
                .limit(8)
                .toList();

        List<String> blockers = reports.stream()
                .map(WeeklyReport::getBlockers)
                .filter(this::hasText)
                .filter(b -> !b.trim().equalsIgnoreCase("none"))
                .limit(8)
                .toList();

        List<String> activeProjects = reports.stream()
                .filter(r -> r.getProject() != null)
                .map(r -> r.getProject().getName())
                .distinct()
                .toList();

        String answer = "Submitted reports this period: " + reports.size()
                + ". Active blockers reported: " + blockers.size()
                + ". Projects worked on: " + (activeProjects.isEmpty() ? "none logged" : String.join(", ", activeProjects)) + ".";

        return new AiSummaryResponse(answer, highlights, blockers, privacyNote());
    }

    public AiSummaryResponse answer(AiQuestionRequest request) {
        AiSummaryResponse summary = summarize(request.weekStart(), request.weekEnd());

        String questionLower = request.question().toLowerCase();
        String contextualAnswer;

        if (questionLower.contains("blocker") || questionLower.contains("challenge") || questionLower.contains("stuck")) {
            contextualAnswer = summary.blockers().isEmpty()
                    ? "No blockers were reported for this period. The team is on track."
                    : "Reported blockers: " + String.join(" | ", summary.blockers());
        } else if (questionLower.contains("project") || questionLower.contains("work") || questionLower.contains("what did")) {
            contextualAnswer = summary.highlights().isEmpty()
                    ? "No submitted reports found for this period."
                    : "Team activity: " + String.join(" | ", summary.highlights());
        } else {
            contextualAnswer = summary.answer();
        }

        return new AiSummaryResponse(contextualAnswer, summary.highlights(), summary.blockers(), summary.privacyNote());
    }

    private String firstSentence(String value) {
        if (!hasText(value)) return "no update logged";
        String trimmed = value.trim();
        int end = trimmed.indexOf('.');
        return end > 0 ? trimmed.substring(0, end + 1) : trimmed;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private List<String> privacyNote() {
        return List.of(
                "This assistant is rule-based and only reads data already stored in this system.",
                "No report content is sent to any third-party AI service.",
                "Only managers can access this assistant, and it only summarizes submitted reports."
        );
    }
}