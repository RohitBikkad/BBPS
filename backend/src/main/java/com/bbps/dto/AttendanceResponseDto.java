package com.bbps.dto;

import com.bbps.model.ApprovalStatus;
import com.bbps.model.FinalAttendanceStatus;
import com.bbps.model.MarkedStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AttendanceResponseDto {
    private Long id;
    private String employeeId;
    private String staffName;
    private String department;
    private String designation;
    private String supervisorEmployeeId;
    private LocalDate attendanceDate;
    private MarkedStatus markedStatus;
    private LocalDateTime markedAt;
    private ApprovalStatus approvalStatus;
    private FinalAttendanceStatus finalStatus;
    private String approvedBy;
    private LocalDateTime approvedAt;
    private String principalRemarks;
    private boolean onLeave;

    public AttendanceResponseDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getSupervisorEmployeeId() {
        return supervisorEmployeeId;
    }

    public void setSupervisorEmployeeId(String supervisorEmployeeId) {
        this.supervisorEmployeeId = supervisorEmployeeId;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public MarkedStatus getMarkedStatus() {
        return markedStatus;
    }

    public void setMarkedStatus(MarkedStatus markedStatus) {
        this.markedStatus = markedStatus;
    }

    public LocalDateTime getMarkedAt() {
        return markedAt;
    }

    public void setMarkedAt(LocalDateTime markedAt) {
        this.markedAt = markedAt;
    }

    public ApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public FinalAttendanceStatus getFinalStatus() {
        return finalStatus;
    }

    public void setFinalStatus(FinalAttendanceStatus finalStatus) {
        this.finalStatus = finalStatus;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public String getPrincipalRemarks() {
        return principalRemarks;
    }

    public void setPrincipalRemarks(String principalRemarks) {
        this.principalRemarks = principalRemarks;
    }

    public boolean isOnLeave() {
        return onLeave;
    }

    public void setOnLeave(boolean onLeave) {
        this.onLeave = onLeave;
    }
}
