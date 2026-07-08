package com.chamodi.weekly_report_backend.dto;

import java.util.List;

public record AiSummaryResponse(
        String answer,
        List<String> highlights,
        List<String> blockers,
        List<String> privacyNote
) {
}