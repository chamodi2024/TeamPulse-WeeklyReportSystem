package com.chamodi.weekly_report_backend.dto;

import jakarta.validation.constraints.NotNull;

public record AssignProjectRequest(
        @NotNull Long userId,
        @NotNull Long projectId
) {
}
