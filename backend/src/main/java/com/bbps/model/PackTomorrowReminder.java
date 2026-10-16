package com.bbps.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pack_tomorrow_reminders", indexes = {
    @Index(name = "idx_reminder_grade_section", columnList = "grade, section, target_date")
})
public class PackTomorrowReminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grade", nullable = false, length = 50)
    private String grade;

    @Column(name = "section", nullable = false, length = 50)
    private String section;

    @Column(name = "target_date", nullable = false)
    private LocalDate targetDate;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "message", length = 1000)
    private String message;

    @Column(name = "items_to_pack", length = 500)
    private String itemsToPack; // e.g. "Yellow apron, 1 yellow fruit, extra towel"

    @Column(name = "dress_code", length = 100)
    private String dressCode; // e.g. "Bright Yellow / Sun theme"

    @Column(name = "badge_tag", length = 50)
    private String badgeTag; // e.g. "IMPORTANT", "EVENT", "COLOR_DAY"

    @Column(name = "created_by_staff_id", length = 50)
    private String createdByStaffId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public PackTomorrowReminder() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getItemsToPack() { return itemsToPack; }
    public void setItemsToPack(String itemsToPack) { this.itemsToPack = itemsToPack; }

    public String getDressCode() { return dressCode; }
    public void setDressCode(String dressCode) { this.dressCode = dressCode; }

    public String getBadgeTag() { return badgeTag; }
    public void setBadgeTag(String badgeTag) { this.badgeTag = badgeTag; }

    public String getCreatedByStaffId() { return createdByStaffId; }
    public void setCreatedByStaffId(String createdByStaffId) { this.createdByStaffId = createdByStaffId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
