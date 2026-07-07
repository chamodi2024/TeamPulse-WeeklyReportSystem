package com.chamodi.weekly_report_backend.dto;

import java.time.LocalDate;

public record TeamReportFilter(
        Long memberId,
        Long projectId,
        LocalDate from,
        LocalDate to
) {
}
