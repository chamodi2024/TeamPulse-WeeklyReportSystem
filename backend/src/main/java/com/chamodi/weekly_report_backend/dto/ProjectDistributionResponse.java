package com.chamodi.weekly_report_backend.dto;

import java.math.BigDecimal;

public record ProjectDistributionResponse(
        Long projectId,
        String projectName,
        long reportCount,
        BigDecimal hoursWorked
) {
}
