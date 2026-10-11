package com.bbps.dto;

import com.bbps.model.FinalAttendanceStatus;
import jakarta.validation.constraints.NotNull;

public class AttendanceApprovalRequest {
    @NotNull(message = "Attendance ID is required")
    private Long attendanceId;

    @NotNull(message = "Final status is required (PRESENT, ABSENT, or ON_LEAVE)")
    private FinalAttendanceStatus finalStatus;

    private String principalRemarks;

    public AttendanceApprovalRequest() {
    }

    public AttendanceApprovalRequest(Long attendanceId, FinalAttendanceStatus finalStatus, String principalRemarks) {
        this.attendanceId = attendanceId;
        this.finalStatus = finalStatus;
        this.principalRemarks = principalRemarks;
    }

    public Long getAttendanceId() {
        return attendanceId;
    }

    public void setAttendanceId(Long attendanceId) {
        this.attendanceId = attendanceId;
    }

    public FinalAttendanceStatus getFinalStatus() {
        return finalStatus;
    }

    public void setFinalStatus(FinalAttendanceStatus finalStatus) {
        this.finalStatus = finalStatus;
    }

    public String getPrincipalRemarks() {
        return principalRemarks;
    }

    public void setPrincipalRemarks(String principalRemarks) {
        this.principalRemarks = principalRemarks;
    }
}
