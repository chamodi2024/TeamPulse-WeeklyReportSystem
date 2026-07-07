package com.chamodi.weekly_report_backend.service;

import com.chamodi.weekly_report_backend.dto.AssignProjectRequest;
import com.chamodi.weekly_report_backend.model.Project;
import com.chamodi.weekly_report_backend.model.User;
import com.chamodi.weekly_report_backend.model.UserProject;
import com.chamodi.weekly_report_backend.exception.ResourceNotFoundException;
import com.chamodi.weekly_report_backend.repository.ProjectRepository;
import com.chamodi.weekly_report_backend.repository.UserProjectRepository;
import com.chamodi.weekly_report_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserProjectService {

    private final UserProjectRepository userProjectRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public void assignUserToProject(AssignProjectRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        boolean alreadyAssigned = userProjectRepository.findByUserId(user.getId())
                .stream()
                .anyMatch(up -> up.getProject().getId().equals(project.getId()));

        if (alreadyAssigned) {
            throw new RuntimeException("User already assigned to this project");
        }

        UserProject userProject = UserProject.builder()
                .user(user)
                .project(project)
                .build();

        userProjectRepository.save(userProject);
    }

    public List<Map<String, Object>> getProjectsForUser(Long userId) {
        return userProjectRepository.findByUserId(userId).stream()
                .map(up -> Map.<String, Object>of(
                        "projectId", up.getProject().getId(),
                        "projectName", up.getProject().getName()
                ))
                .toList();
    }

    public void removeAssignment(Long userId, Long projectId) {
        UserProject userProject = userProjectRepository.findByUserId(userId).stream()
                .filter(up -> up.getProject().getId().equals(projectId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        userProjectRepository.delete(userProject);
    }
}