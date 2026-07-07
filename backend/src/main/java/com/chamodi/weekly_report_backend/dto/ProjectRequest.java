package com.chamodi.weekly_report_backend.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;
}