package com.chamodi.weekly_report_backend.controller;



import com.chamodi.weekly_report_backend.dto.AssignProjectRequest;
import com.chamodi.weekly_report_backend.service.UserProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-projects")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class UserProjectController {

    private final UserProjectService userProjectService;

    @PostMapping("/assign")
    public ResponseEntity<String> assignUserToProject(@Valid @RequestBody AssignProjectRequest request) {
        userProjectService.assignUserToProject(request);
        return ResponseEntity.ok("User assigned to project successfully");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getProjectsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userProjectService.getProjectsForUser(userId));
    }

    @DeleteMapping("/user/{userId}/project/{projectId}")
    public ResponseEntity<String> removeAssignment(@PathVariable Long userId, @PathVariable Long projectId) {
        userProjectService.removeAssignment(userId, projectId);
        return ResponseEntity.ok("Assignment removed successfully");
    }
}