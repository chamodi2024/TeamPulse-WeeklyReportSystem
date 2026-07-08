package com.chamodi.weekly_report_backend.controller;

import com.chamodi.weekly_report_backend.dto.UserSummaryResponse;
import com.chamodi.weekly_report_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class UserController {

    private final UserService userService;

    @GetMapping("/members")
    public ResponseEntity<List<UserSummaryResponse>> getAllMembers() {
        return ResponseEntity.ok(userService.getAllMembers());
    }
}