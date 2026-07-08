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

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')") // Restricts all endpoints to users with MANAGER role
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    /**
     * Endpoint to fetch the AI-generated weekly summary for the team.
     * Accessible only by Managers.
     */
    @GetMapping("/summary")
    public ResponseEntity<AiSummaryResponse> summary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekEnd) {

        return ResponseEntity.ok(aiAssistantService.summarize(weekStart, weekEnd));
    }

    /**
     * Endpoint for Managers to ask natural language questions about team activity.
     * Accessible only by Managers.
     */
    @PostMapping("/ask")
    public ResponseEntity<AiSummaryResponse> ask(@Valid @RequestBody AiQuestionRequest request) {

        return ResponseEntity.ok(aiAssistantService.answer(request));
    }
}