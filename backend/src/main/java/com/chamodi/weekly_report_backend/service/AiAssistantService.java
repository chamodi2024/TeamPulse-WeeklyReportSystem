package com.chamodi.weekly_report_backend.service;

import com.chamodi.weekly_report_backend.dto.AiQuestionRequest;
import com.chamodi.weekly_report_backend.dto.AiSummaryResponse;
import com.chamodi.weekly_report_backend.model.ReportStatus;
import com.chamodi.weekly_report_backend.model.WeeklyReport;
import com.chamodi.weekly_report_backend.repository.WeeklyReportRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class AiAssistantService {

    private final WeeklyReportRepository reportRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    // Use the base URL without the key, we will append it safely
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public AiAssistantService(WeeklyReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public AiSummaryResponse summarize(LocalDate weekStart, LocalDate weekEnd) {
        List<WeeklyReport> reports = getSubmittedReports(weekStart, weekEnd);
        List<String> highlights = reports.stream()
                .map(r -> r.getUser().getName() + ": " + r.getTasksCompleted())
                .limit(8).toList();

        String prompt = "Summarize these team reports in 2-3 sentences: " + highlights;
        return new AiSummaryResponse(callGemini(prompt), highlights, List.of(), List.of("Powered by Gemini Free Tier"));
    }

    public AiSummaryResponse answer(AiQuestionRequest request) {
        String prompt = "Answer this question based on the reports: " + request.question();
        return new AiSummaryResponse(callGemini(prompt), List.of(), List.of(), List.of("Powered by Gemini Free Tier"));
    }

    private String callGemini(String prompt) {
        String url = GEMINI_API_URL + "?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            log.info("Connecting to Gemini API...");
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getBody() != null && response.getBody().containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                return (String) parts.get(0).get("text");
            }
            return "AI returned an empty response.";
        } catch (Exception e) {
            // This log will capture the exact status code (404, 400, 403)
            log.error("Gemini API Request failed. Full error: ", e);
            return "AI service is currently unreachable. Check server logs for details.";
        }
    }

    private List<WeeklyReport> getSubmittedReports(LocalDate start, LocalDate end) {
        return reportRepository.findWithFilters(null, null, start, end).stream()
                .filter(r -> r.getStatus() == ReportStatus.SUBMITTED).toList();
    }
}