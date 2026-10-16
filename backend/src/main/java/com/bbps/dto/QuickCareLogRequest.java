package com.bbps.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class QuickCareLogRequest {

    @NotNull
    private Long studentId;
    private LocalDate logDate;
    private String checkInTime;
    private String checkOutTime;
    private String attendanceStatus;
    private String mealStatus;
    private String mealNotes;
    private Integer napMinutes;
    private String napNotes;
    private String mood;
    private String temperature;
    private Boolean medicationGiven;
    private String medicationNotes;
    private String teacherNotes;
    private String activitiesSummary;

    public QuickCareLogRequest() {}

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

    public String getTeacherNotes() { return teacherNotes; }
    public void setTeacherNotes(String teacherNotes) { this.teacherNotes = teacherNotes; }

    public String getActivitiesSummary() { return activitiesSummary; }
    public void setActivitiesSummary(String activitiesSummary) { this.activitiesSummary = activitiesSummary; }
}
