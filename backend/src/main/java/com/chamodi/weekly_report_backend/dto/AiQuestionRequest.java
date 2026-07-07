package com.chamodi.weekly_report_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record AiQuestionRequest(
        @NotBlank String question,
        @NotNull LocalDate weekStart,
        @NotNull LocalDate weekEnd
) {
}
