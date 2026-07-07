package com.chamodi.weekly_report_backend.repository;



import com.chamodi.weekly_report_backend.model.UserProject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserProjectRepository extends JpaRepository<UserProject, Long> {
    List<UserProject> findByUserId(Long userId);
}