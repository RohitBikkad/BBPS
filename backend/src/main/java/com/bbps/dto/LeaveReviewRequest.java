package com.bbps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LeaveReviewRequest {
    @NotNull(message = "Leave Request ID is required")
    private Long leaveRequestId;

    @NotBlank(message = "Action is required (APPROVE or REJECT)")
    private String action; // APPROVE or REJECT

    private String remarks;

    public LeaveReviewRequest() {
    }

    public LeaveReviewRequest(Long leaveRequestId, String action, String remarks) {
        this.leaveRequestId = leaveRequestId;
        this.action = action;
        this.remarks = remarks;
    }

    public Long getLeaveRequestId() {
        return leaveRequestId;
    }

    public void setLeaveRequestId(Long leaveRequestId) {
        this.leaveRequestId = leaveRequestId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
