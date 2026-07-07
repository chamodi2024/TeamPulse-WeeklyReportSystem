package com.chamodi.weekly_report_backend.service;

import com.chamodi.weekly_report_backend.dto.UserResponse;
import com.chamodi.weekly_report_backend.model.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    private final ProjectMapper projectMapper;

    public UserMapper(ProjectMapper projectMapper) {
        this.projectMapper = projectMapper;
    }

    public UserResponse toResponse(User user) {

        if (user == null) {
            return null;
        }

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled(),

                (user.getProjects() == null)
                        ? Collections.emptySet()
                        : user.getProjects()
                        .stream()
                        .map(projectMapper::toResponse)
                        .collect(Collectors.toSet()),

                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}