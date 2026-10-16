package com.bbps.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_daily_care_logs", indexes = {
    @Index(name = "idx_student_care_log_date", columnList = "student_id, log_date", unique = true)
})
public class StudentDailyCareLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "check_in_time", length = 30)
    private String checkInTime; // e.g. "08:45 AM"

    @Column(name = "check_out_time", length = 30)
    private String checkOutTime; // e.g. "12:30 PM"

    @Column(name = "attendance_status", length = 30)
    private String attendanceStatus = "PRESENT"; // PRESENT, ABSENT, ON_LEAVE

    @Column(name = "meal_status", length = 50)
    private String mealStatus = "FINISHED_ALL"; // FINISHED_ALL, PARTIALLY_EATEN, REFUSED, BROUGHT_FRUIT

    @Column(name = "meal_notes", length = 300)
    private String mealNotes;

    @Column(name = "nap_minutes")
    private Integer napMinutes = 40;

    @Column(name = "nap_notes", length = 200)
    private String napNotes;

    @Column(name = "mood", length = 50)
    private String mood = "HAPPY"; // HAPPY, PLAYFUL, CALM, TEARFUL, TIRED

    @Column(name = "temperature", length = 30)
    private String temperature = "98.4 °F";

    @Column(name = "medication_given")
    private Boolean medicationGiven = false;

    @Column(name = "medication_notes", length = 300)
    private String medicationNotes;

    @Column(name = "activities_summary", length = 500)
    private String activitiesSummary;

    @Column(name = "teacher_notes", length = 500)
    private String teacherNotes;

    @Column(name = "recorded_by_staff_id", length = 50)
    private String recordedByStaffId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public StudentDailyCareLog() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public LocalDate getLogDate() { return logDate; }
    public void setLogDate(LocalDate logDate) { this.logDate = logDate; }

    public String getCheckInTime() { return checkInTime; }
    public void setCheckInTime(String checkInTime) { this.checkInTime = checkInTime; }

    public String getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; }

    public String getAttendanceStatus() { return attendanceStatus; }
    public void setAttendanceStatus(String attendanceStatus) { this.attendanceStatus = attendanceStatus; }

    public String getMealStatus() { return mealStatus; }
    public void setMealStatus(String mealStatus) { this.mealStatus = mealStatus; }

    public String getMealNotes() { return mealNotes; }
    public void setMealNotes(String mealNotes) { this.mealNotes = mealNotes; }

    public Integer getNapMinutes() { return napMinutes; }
    public void setNapMinutes(Integer napMinutes) { this.napMinutes = napMinutes; }

    public String getNapNotes() { return napNotes; }
    public void setNapNotes(String napNotes) { this.napNotes = napNotes; }

    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }

    public String getTemperature() { return temperature; }
    public void setTemperature(String temperature) { this.temperature = temperature; }

    public Boolean getMedicationGiven() { return medicationGiven; }
    public void setMedicationGiven(Boolean medicationGiven) { this.medicationGiven = medicationGiven; }

    public String getMedicationNotes() { return medicationNotes; }
    public void setMedicationNotes(String medicationNotes) { this.medicationNotes = medicationNotes; }

    public String getActivitiesSummary() { return activitiesSummary; }
    public void setActivitiesSummary(String activitiesSummary) { this.activitiesSummary = activitiesSummary; }

    public String getTeacherNotes() { return teacherNotes; }
    public void setTeacherNotes(String teacherNotes) { this.teacherNotes = teacherNotes; }

    public String getRecordedByStaffId() { return recordedByStaffId; }
    public void setRecordedByStaffId(String recordedByStaffId) { this.recordedByStaffId = recordedByStaffId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
