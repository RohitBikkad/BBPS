package com.bbps.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_moments", indexes = {
    @Index(name = "idx_moment_class_date", columnList = "grade, section, moment_date")
})
public class StudentMoment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id")
    private Long studentId; // If null, applies to whole class

    @Column(name = "grade", nullable = false, length = 50)
    private String grade;

    @Column(name = "section", nullable = false, length = 50)
    private String section;

    @Column(name = "moment_date", nullable = false)
    private LocalDate momentDate;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "category", nullable = false, length = 50)
    private String category; // ACTIVITY, ART_CRAFT, RHYME_MUSIC, SPORTS_PLAY, EVENT

    @Column(name = "media_url", length = 500)
    private String mediaUrl;

    @Column(name = "tags", length = 200)
    private String tags; // e.g. "#SensoryPlay, #FingerPainting"

    @Column(name = "weekly_theme", length = 150)
    private String weeklyTheme;

    @Column(name = "rhyme_lyrics", length = 1000)
    private String rhymeLyrics;

    @Column(name = "audio_url", length = 500)
    private String audioUrl;

    @Column(name = "created_by_staff_id", length = 50)
    private String createdByStaffId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public StudentMoment() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public LocalDate getMomentDate() { return momentDate; }
    public void setMomentDate(LocalDate momentDate) { this.momentDate = momentDate; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getWeeklyTheme() { return weeklyTheme; }
    public void setWeeklyTheme(String weeklyTheme) { this.weeklyTheme = weeklyTheme; }

    public String getRhymeLyrics() { return rhymeLyrics; }
    public void setRhymeLyrics(String rhymeLyrics) { this.rhymeLyrics = rhymeLyrics; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getCreatedByStaffId() { return createdByStaffId; }
    public void setCreatedByStaffId(String createdByStaffId) { this.createdByStaffId = createdByStaffId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
