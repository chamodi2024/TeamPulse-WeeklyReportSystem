package com.chamodi.weekly_report_backend.dto;

import com.chamodi.weekly_report_backend.model.Role;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(@NotNull Role role) {
}
