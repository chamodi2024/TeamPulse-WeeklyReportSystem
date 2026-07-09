package com.chamodi.weekly_report_backend.service;

import com.chamodi.weekly_report_backend.dto.ProjectRequest;
import com.chamodi.weekly_report_backend.dto.ProjectResponse;
import com.chamodi.weekly_report_backend.model.Project;
import com.chamodi.weekly_report_backend.exception.ResourceNotFoundException;
import com.chamodi.weekly_report_backend.repository.ProjectRepository;
import com.chamodi.weekly_report_backend.repository.WeeklyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final WeeklyReportRepository weeklyReportRepository;

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

    /**
     * Safely deletes a project entity by executing cascade cleanup routines across
     * related relational tables to comply with native database constraint restrictions.
     * * @param id Unique identification key of the targeted project record
     */
    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        // 1. Purge linked user allocation mappings inside the intermediate join entity table (user_project)
        projectRepository.removeUserAssociations(id);

        // 2. Clear out foreign key references attached to logging report entities (weekly_report)
        weeklyReportRepository.clearProjectReferences(id);

        // 3. Complete absolute removal of the unlinked structural project record
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