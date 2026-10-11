package com.bbps.dto;

import com.bbps.model.ApprovalStatus;
import com.bbps.model.LeaveStatus;
import com.bbps.model.LeaveType;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveResponseDto {
    private Long id;
    private String employeeId;
    private String staffName;
    private String department;
    private String designation;
    private String supervisorEmployeeId;
    private LeaveType leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalDays;
    private Integer paidDays;
    private Integer unpaidDays;
    private String reason;
    private String attachmentUrl;
    private ApprovalStatus supervisorStatus;
    private String supervisorRemarks;
    private String supervisorReviewedBy;
    private LocalDateTime supervisorReviewedAt;
    private ApprovalStatus principalStatus;
    private String principalRemarks;
    private String principalApprovedBy;
    private LocalDateTime principalApprovedAt;
    private LeaveStatus finalStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LeaveResponseDto() {
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

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(Integer totalDays) {
        this.totalDays = totalDays;
    }

    public Integer getPaidDays() {
        return paidDays;
    }

    public void setPaidDays(Integer paidDays) {
        this.paidDays = paidDays;
    }

    public Integer getUnpaidDays() {
        return unpaidDays;
    }

    public void setUnpaidDays(Integer unpaidDays) {
        this.unpaidDays = unpaidDays;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }

    public ApprovalStatus getSupervisorStatus() {
        return supervisorStatus;
    }

    public void setSupervisorStatus(ApprovalStatus supervisorStatus) {
        this.supervisorStatus = supervisorStatus;
    }

    public String getSupervisorRemarks() {
        return supervisorRemarks;
    }

    public void setSupervisorRemarks(String supervisorRemarks) {
        this.supervisorRemarks = supervisorRemarks;
    }

    public String getSupervisorReviewedBy() {
        return supervisorReviewedBy;
    }

    public void setSupervisorReviewedBy(String supervisorReviewedBy) {
        this.supervisorReviewedBy = supervisorReviewedBy;
    }

    public LocalDateTime getSupervisorReviewedAt() {
        return supervisorReviewedAt;
    }

    public void setSupervisorReviewedAt(LocalDateTime supervisorReviewedAt) {
        this.supervisorReviewedAt = supervisorReviewedAt;
    }

    public ApprovalStatus getPrincipalStatus() {
        return principalStatus;
    }

    public void setPrincipalStatus(ApprovalStatus principalStatus) {
        this.principalStatus = principalStatus;
    }

    public String getPrincipalRemarks() {
        return principalRemarks;
    }

    public void setPrincipalRemarks(String principalRemarks) {
        this.principalRemarks = principalRemarks;
    }

    public String getPrincipalApprovedBy() {
        return principalApprovedBy;
    }

    public void setPrincipalApprovedBy(String principalApprovedBy) {
        this.principalApprovedBy = principalApprovedBy;
    }

    public LocalDateTime getPrincipalApprovedAt() {
        return principalApprovedAt;
    }

    public void setPrincipalApprovedAt(LocalDateTime principalApprovedAt) {
        this.principalApprovedAt = principalApprovedAt;
    }

    public LeaveStatus getFinalStatus() {
        return finalStatus;
    }

    public void setFinalStatus(LeaveStatus finalStatus) {
        this.finalStatus = finalStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
