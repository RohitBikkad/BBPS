package com.bbps.dto;

import com.bbps.model.MarkedStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AttendanceMarkRequest {
    @NotNull(message = "Marked status is required (PRESENT or ABSENT)")
    private MarkedStatus markedStatus;

    private LocalDate attendanceDate; // defaults to today if null

    public AttendanceMarkRequest() {
    }

    public AttendanceMarkRequest(MarkedStatus markedStatus, LocalDate attendanceDate) {
        this.markedStatus = markedStatus;
        this.attendanceDate = attendanceDate;
    }

    public MarkedStatus getMarkedStatus() {
        return markedStatus;
    }

    public void setMarkedStatus(MarkedStatus markedStatus) {
        this.markedStatus = markedStatus;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }
}
