package com.chamodi.weekly_report_backend.controller;

import com.chamodi.weekly_report_backend.dto.AiQuestionRequest;
import com.chamodi.weekly_report_backend.dto.AiSummaryResponse;
import com.chamodi.weekly_report_backend.service.AiAssistantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * Controller to handle AI-powered interactions for Team Managers.
 */
@RestController
@RequestMapping("/api/assistant")
@CrossOrigin(origins = "http://localhost:5173") // Ensure this matches your React frontend port
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    /**
     * Fetches a summary of team activity for the specified week.
     * * @param weekStart Start date of the reporting period
     * @param weekEnd End date of the reporting period
     * @return AI-generated summary response
     */
    @GetMapping("/summary")
    public ResponseEntity<AiSummaryResponse> getSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekEnd) {

        return ResponseEntity.ok(aiAssistantService.summarize(weekStart, weekEnd));
    }

    /**
     * Processes natural language questions from managers based on report data.
     * * @param request Contains the question and date range
     * @return AI-generated answer based on the provided context
     */
    @PostMapping("/ask")
    public ResponseEntity<AiSummaryResponse> askQuestion(@Valid @RequestBody AiQuestionRequest request) {

        return ResponseEntity.ok(aiAssistantService.answer(request));
    }
}