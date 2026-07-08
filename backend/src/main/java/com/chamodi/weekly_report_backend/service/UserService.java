package com.chamodi.weekly_report_backend.service;

import com.chamodi.weekly_report_backend.dto.UserSummaryResponse;
import com.chamodi.weekly_report_backend.model.Role;
import com.chamodi.weekly_report_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserSummaryResponse> getAllMembers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.MEMBER)
                .map(u -> UserSummaryResponse.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .role(u.getRole().name())
                        .build())
                .toList();
    }
}