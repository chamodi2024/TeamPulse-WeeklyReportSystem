package com.chamodi.weekly_report_backend.service;



import com.chamodi.weekly_report_backend.dto.ProjectRequest;
import com.chamodi.weekly_report_backend.dto.ProjectResponse;
import com.chamodi.weekly_report_backend.model.Project;
import com.chamodi.weekly_report_backend.exception.ResourceNotFoundException;
import com.chamodi.weekly_report_backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectResponse createProject(ProjectRequest request) {
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        projectRepository.save(project);
        return mapToResponse(project);
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        return mapToResponse(project);
    }

    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        projectRepository.save(project);
        return mapToResponse(project);
    }

    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        projectRepository.delete(project);
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .build();
    }
}