package com.bbps.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests", indexes = {
    @Index(name = "idx_leave_emp", columnList = "employee_id"),
    @Index(name = "idx_leave_dates", columnList = "start_date, end_date"),
    @Index(name = "idx_leave_status", columnList = "final_status")
})
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false, length = 50)
    private String employeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false, length = 30)
    private LeaveType leaveType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "total_days", nullable = false)
    private Integer totalDays;

    @Column(name = "paid_days", nullable = false)
    private Integer paidDays;

    @Column(name = "unpaid_days", nullable = false)
    private Integer unpaidDays;

    @Column(name = "reason", nullable = false, length = 1000)
    private String reason;

    @Column(name = "attachment_url", length = 500)
    private String attachmentUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "supervisor_status", length = 30)
    private ApprovalStatus supervisorStatus = ApprovalStatus.PENDING;

    @Column(name = "supervisor_remarks", length = 500)
    private String supervisorRemarks;

    @Column(name = "supervisor_reviewed_by", length = 50)
    private String supervisorReviewedBy;

    @Column(name = "supervisor_reviewed_at")
    private LocalDateTime supervisorReviewedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "principal_status", length = 30)
    private ApprovalStatus principalStatus = ApprovalStatus.PENDING;

    @Column(name = "principal_remarks", length = 500)
    private String principalRemarks;

    @Column(name = "principal_approved_by", length = 50)
    private String principalApprovedBy;

    @Column(name = "principal_approved_at")
    private LocalDateTime principalApprovedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "final_status", nullable = false, length = 40)
    private LeaveStatus finalStatus = LeaveStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public LeaveRequest() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.supervisorStatus == null) {
            this.supervisorStatus = ApprovalStatus.PENDING;
        }
        if (this.principalStatus == null) {
            this.principalStatus = ApprovalStatus.PENDING;
        }
        if (this.finalStatus == null) {
            this.finalStatus = LeaveStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
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
