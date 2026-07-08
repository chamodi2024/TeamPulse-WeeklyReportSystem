package com.chamodi.weekly_report_backend.service;

import com.chamodi.weekly_report_backend.dto.AiQuestionRequest;
import com.chamodi.weekly_report_backend.dto.AiSummaryResponse;
import com.chamodi.weekly_report_backend.model.ReportStatus;
import com.chamodi.weekly_report_backend.model.WeeklyReport;
import com.chamodi.weekly_report_backend.repository.WeeklyReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiAssistantService {

    private final WeeklyReportRepository reportRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    //Line 25 එක මෙහෙම වෙනස් කරන්න
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

    public AiSummaryResponse summarize(LocalDate weekStart, LocalDate weekEnd) {
        List<WeeklyReport> reports = getSubmittedReports(weekStart, weekEnd);

        List<String> highlights = reports.stream()
                .map(r -> r.getUser().getName() + " completed: " + r.getTasksCompleted())
                .limit(8).toList();

        List<String> blockers = reports.stream()
                .map(WeeklyReport::getBlockers)
                .filter(b -> b != null && !b.isBlank() && !b.equalsIgnoreCase("none"))
                .limit(8).toList();

        String prompt = "You are a manager's AI assistant. Summarize these team reports in 2-3 sentences:\n" +
                "Highlights: " + highlights + "\nBlockers: " + blockers;

        return new AiSummaryResponse(callGeminiApi(prompt), highlights, blockers, List.of("Powered by Google Gemini AI"));
    }

    public AiSummaryResponse answer(AiQuestionRequest request) {
        List<WeeklyReport> reports = getSubmittedReports(request.weekStart(), request.weekEnd());

        StringBuilder context = new StringBuilder("Team Reports context:\n");
        for (WeeklyReport r : reports) {
            context.append("- ").append(r.getUser().getName())
                    .append(" task: ").append(r.getTasksCompleted())
                    .append(" | Blockers: ").append(r.getBlockers()).append("\n");
        }

        String prompt = "You are a team manager's AI assistant. Use ONLY this data to answer the manager's question.\n\n" +
                context + "\n\nQuestion: " + request.question();

        AiSummaryResponse summary = summarize(request.weekStart(), request.weekEnd());

        return new AiSummaryResponse(callGeminiApi(prompt), summary.highlights(), summary.blockers(), summary.privacyNote());
    }

    private List<WeeklyReport> getSubmittedReports(LocalDate start, LocalDate end) {
        return reportRepository.findWithFilters(null, null, start, end)
                .stream().filter(r -> r.getStatus() == ReportStatus.SUBMITTED).toList();
    }

    private String callGeminiApi(String prompt) {
        try {
            String url = GEMINI_API_URL + "?key=" + geminiApiKey;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            // Execute the request
            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                return (String) parts.get(0).get("text");
            }
            return "AI returned an empty response.";
        } catch (Exception e) {
            // This prints the actual error to your IDE console so you can fix it
            log.error("Error connecting to Gemini API: ", e);
            return "AI is currently unavailable due to: " + e.getMessage();
        }
    }
}