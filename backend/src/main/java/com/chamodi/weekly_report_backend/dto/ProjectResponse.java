package com.chamodi.weekly_report_backend.dto;



import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
}
