package com.chamodi.weekly_report_backend.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WeeklyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(nullable = false)
    private LocalDate weekStart;

    @Column(nullable = false)
    private LocalDate weekEnd;

    @Column(columnDefinition = "TEXT")
    private String tasksCompleted;

    @Column(columnDefinition = "TEXT")
    private String tasksPlanned;

    @Column(columnDefinition = "TEXT")
    private String blockers;

    private Double hoursWorked;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;

    private LocalDateTime submittedAt;
}