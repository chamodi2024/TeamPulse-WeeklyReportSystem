package com.chamodi.weekly_report_backend.config;

import com.chamodi.weekly_report_backend.model.Project;
import com.chamodi.weekly_report_backend.model.Role;
import com.chamodi.weekly_report_backend.model.User;
import com.chamodi.weekly_report_backend.repository.ProjectRepository;
import com.chamodi.weekly_report_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, ProjectRepository projectRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedProjects();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setFullName("Admin Manager");
            admin.setEmail("admin@example.com");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("member@example.com")) {
            User member = new User();
            member.setFullName("Team Member");
            member.setEmail("member@example.com");
            member.setPasswordHash(passwordEncoder.encode("Member@123"));
            member.setRole(Role.TEAM_MEMBER);
            member.setEnabled(true);
            userRepository.save(member);
        }
    }

    private void seedProjects() {
        List<String> names = List.of("Client A", "Internal Tooling", "R&D", "Marketing");
        names.forEach(name -> {
            if (!projectRepository.existsByNameIgnoreCase(name)) {
                Project project = new Project();
                project.setName(name);
                project.setDescription(name + " weekly work category");
                projectRepository.save(project);
            }
        });
    }
}
