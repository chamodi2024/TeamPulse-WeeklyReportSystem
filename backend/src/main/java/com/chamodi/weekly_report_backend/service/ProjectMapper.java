package com.chamodi.weekly_report_backend.service;

import com.chamodi.weekly_report_backend.dto.ProjectResponse;
import com.chamodi.weekly_report_backend.model.Project;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {
    public ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.isActive(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}
