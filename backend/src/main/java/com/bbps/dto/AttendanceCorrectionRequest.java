package com.bbps.dto;

import com.bbps.model.FinalAttendanceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AttendanceCorrectionRequest {
    @NotNull(message = "Attendance ID is required")
    private Long attendanceId;

    @NotNull(message = "New Status is required")
    private FinalAttendanceStatus newStatus;

    @NotBlank(message = "Audit reason is required for correcting attendance")
    private String reason;

    public AttendanceCorrectionRequest() {
    }

    public AttendanceCorrectionRequest(Long attendanceId, FinalAttendanceStatus newStatus, String reason) {
        this.attendanceId = attendanceId;
        this.newStatus = newStatus;
        this.reason = reason;
    }

    public Long getAttendanceId() {
        return attendanceId;
    }

    public void setAttendanceId(Long attendanceId) {
        this.attendanceId = attendanceId;
    }

    public FinalAttendanceStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(FinalAttendanceStatus newStatus) {
        this.newStatus = newStatus;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
