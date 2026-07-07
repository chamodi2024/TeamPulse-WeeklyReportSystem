package com.chamodi.weekly_report_backend.repository;



import com.chamodi.weekly_report_backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
