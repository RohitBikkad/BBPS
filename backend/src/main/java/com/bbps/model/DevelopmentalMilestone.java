package com.bbps.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "developmental_milestones", indexes = {
    @Index(name = "idx_milestone_student_id", columnList = "student_id")
})
public class DevelopmentalMilestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "term", nullable = false, length = 50)
    private String term; // e.g. "Term 1 (2026-2027)"

    @Column(name = "domain", nullable = false, length = 50)
    private String domain; // FINE_MOTOR, GROSS_MOTOR, LANGUAGE, SOCIAL_EMOTIONAL, COGNITIVE

    @Column(name = "skill_title", nullable = false, length = 200)
    private String skillTitle; // e.g. "Holds crayons with 3-finger pincer grip"

    @Column(name = "rating", nullable = false, length = 30)
    private String rating; // ACHIEVED, DEVELOPING, EMERGING

    @Column(name = "badge_title", length = 100)
    private String badgeTitle; // e.g. "Star Colorist", "Playground Champion", "Sharing Hero"

    @Column(name = "badge_icon", length = 50)
    private String badgeIcon; // e.g. "star", "heart", "palette", "smile", "sparkles"

    @Column(name = "teacher_notes", length = 500)
    private String teacherNotes;

    @Column(name = "evaluated_date")
    private LocalDate evaluatedDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public DevelopmentalMilestone() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getSkillTitle() { return skillTitle; }
    public void setSkillTitle(String skillTitle) { this.skillTitle = skillTitle; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getBadgeTitle() { return badgeTitle; }
    public void setBadgeTitle(String badgeTitle) { this.badgeTitle = badgeTitle; }

    public String getBadgeIcon() { return badgeIcon; }
    public void setBadgeIcon(String badgeIcon) { this.badgeIcon = badgeIcon; }

    public String getTeacherNotes() { return teacherNotes; }
    public void setTeacherNotes(String teacherNotes) { this.teacherNotes = teacherNotes; }

    public LocalDate getEvaluatedDate() { return evaluatedDate; }
    public void setEvaluatedDate(LocalDate evaluatedDate) { this.evaluatedDate = evaluatedDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
