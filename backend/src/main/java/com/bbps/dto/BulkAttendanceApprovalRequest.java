package com.bbps.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BulkAttendanceApprovalRequest {
    @NotNull(message = "Date is required")
    private LocalDate attendanceDate;

    private String principalRemarks;

    public BulkAttendanceApprovalRequest() {
    }

    public BulkAttendanceApprovalRequest(LocalDate attendanceDate, String principalRemarks) {
        this.attendanceDate = attendanceDate;
        this.principalRemarks = principalRemarks;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public String getPrincipalRemarks() {
        return principalRemarks;
    }

    public void setPrincipalRemarks(String principalRemarks) {
        this.principalRemarks = principalRemarks;
    }
}
