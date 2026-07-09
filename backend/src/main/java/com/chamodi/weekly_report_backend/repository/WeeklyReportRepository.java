package com.chamodi.weekly_report_backend.repository;

import com.chamodi.weekly_report_backend.model.ReportStatus;
import com.chamodi.weekly_report_backend.model.WeeklyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface WeeklyReportRepository extends JpaRepository<WeeklyReport, Long> {

    List<WeeklyReport> findByUserId(Long userId);

    List<WeeklyReport> findByUserIdOrderByWeekStartDesc(Long userId);

    List<WeeklyReport> findByWeekStartAndWeekEnd(LocalDate weekStart, LocalDate weekEnd);

    List<WeeklyReport> findByProjectId(Long projectId);

    @Query("SELECT r FROM WeeklyReport r WHERE " +
            "(:userId IS NULL OR r.user.id = :userId) AND " +
            "(:projectId IS NULL OR r.project.id = :projectId) AND " +
            "(:startDate IS NULL OR r.weekStart >= :startDate) AND " +
            "(:endDate IS NULL OR r.weekEnd <= :endDate)")
    List<WeeklyReport> findWithFilters(
            @Param("userId") Long userId,
            @Param("projectId") Long projectId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    long countByWeekStartAndWeekEnd(LocalDate weekStart, LocalDate weekEnd);

    long countByWeekStartAndWeekEndAndStatus(LocalDate weekStart, LocalDate weekEnd, ReportStatus status);

    @Query("SELECT COUNT(r) FROM WeeklyReport r WHERE r.blockers IS NOT NULL AND r.blockers <> '' " +
            "AND r.blockers <> 'None' AND r.weekStart = :weekStart AND r.weekEnd = :weekEnd")
    long countOpenBlockers(@Param("weekStart") LocalDate weekStart, @Param("weekEnd") LocalDate weekEnd);

    @Query("SELECT r.project.name as projectName, COUNT(r) as reportCount, COALESCE(SUM(r.hoursWorked), 0) as totalHours " +
            "FROM WeeklyReport r WHERE r.project IS NOT NULL GROUP BY r.project.name")
    List<Object[]> getWorkloadByProject();

    @Query("SELECT r.weekStart as weekStart, r.user.name as userName, COUNT(r) as taskCount " +
            "FROM WeeklyReport r GROUP BY r.weekStart, r.user.name ORDER BY r.weekStart ASC")
    List<Object[]> getTaskTrend();

    /**
     * Updates all weekly reports associated with a specific project by setting
     * their project reference to null. This prevents foreign key constraint errors
     * when deleting a project.
     * * @param projectId The ID of the project being deleted
     */
    @Modifying
    @Query("UPDATE WeeklyReport w SET w.project = null WHERE w.project.id = :projectId")
    void clearProjectReferences(@Param("projectId") Long projectId);
}