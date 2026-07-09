package com.chamodi.weekly_report_backend.repository;

import com.chamodi.weekly_report_backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    /**
     * Native SQL query to remove the many-to-many relationship in the 'user_project'
     * join table. This prevents the "Cannot delete or update a parent row"
     * Foreign Key Constraint error when deleting a project.
     * * @param projectId The ID of the project being deleted
     */
    @Modifying
    @Query(value = "DELETE FROM user_project WHERE project_id = :projectId", nativeQuery = true)
    void removeUserAssociations(@Param("projectId") Long projectId);

}