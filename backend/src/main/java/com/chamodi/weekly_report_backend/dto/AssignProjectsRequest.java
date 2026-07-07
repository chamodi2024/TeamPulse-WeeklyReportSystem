package com.chamodi.weekly_report_backend.dto;

import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record AssignProjectsRequest(@NotNull Set<Long> projectIds) {
}
