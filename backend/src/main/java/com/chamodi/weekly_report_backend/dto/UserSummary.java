package com.chamodi.weekly_report_backend.dto;

import com.chamodi.weekly_report_backend.model.Role;

public record UserSummary(
        Long id,
        String fullName,
        String email,
        Role role
) {
}
