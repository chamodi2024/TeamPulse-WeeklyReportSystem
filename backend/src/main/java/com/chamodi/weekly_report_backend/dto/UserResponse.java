package com.chamodi.weekly_report_backend.dto;

import com.chamodi.weekly_report_backend.model.Role;

import java.time.Instant;
import java.util.Set;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        boolean enabled,
        Set<ProjectResponse> projects,
        Instant createdAt,
        Instant updatedAt
) {
}
