package com.bbps.dto;

import java.util.Map;

public class DashboardStatsDto {
    // Principal & Supervisor Metrics
    private long totalStaff;
    private long presentToday;
    private long absentToday;
    private long onLeaveToday;
    private long notMarkedToday;
    private long pendingAttendanceApprovals;
    private long pendingLeaveRequests;
    private long approvedLeaves;
    private long rejectedLeaves;

    // Staff Specific Metrics
    private int myPaidLeaveTotal = 8;
    private int myPaidLeaveUsed;
    private int myPaidLeaveRemaining;
    private long myPendingLeaves;
    private long myApprovedLeaves;
    private long myRejectedLeaves;

    private long myPresentDays;
    private long myAbsentDays;
    private long myLeaveDays;
    private double myAttendancePercentage;
    private AttendanceResponseDto todayAttendance;

    private Map<String, Long> departmentBreakdown;

    public DashboardStatsDto() {
    }

    public long getTotalStaff() {
        return totalStaff;
    }

    public void setTotalStaff(long totalStaff) {
        this.totalStaff = totalStaff;
    }

    public long getPresentToday() {
        return presentToday;
    }

    public void setPresentToday(long presentToday) {
        this.presentToday = presentToday;
    }

    public long getAbsentToday() {
        return absentToday;
    }

    public void setAbsentToday(long absentToday) {
        this.absentToday = absentToday;
    }

    public long getOnLeaveToday() {
        return onLeaveToday;
    }

    public void setOnLeaveToday(long onLeaveToday) {
        this.onLeaveToday = onLeaveToday;
    }

    public long getNotMarkedToday() {
        return notMarkedToday;
    }

    public void setNotMarkedToday(long notMarkedToday) {
        this.notMarkedToday = notMarkedToday;
    }

    public long getPendingAttendanceApprovals() {
        return pendingAttendanceApprovals;
    }

    public void setPendingAttendanceApprovals(long pendingAttendanceApprovals) {
        this.pendingAttendanceApprovals = pendingAttendanceApprovals;
    }

    public long getPendingLeaveRequests() {
        return pendingLeaveRequests;
    }

    public void setPendingLeaveRequests(long pendingLeaveRequests) {
        this.pendingLeaveRequests = pendingLeaveRequests;
    }

    public long getApprovedLeaves() {
        return approvedLeaves;
    }

    public void setApprovedLeaves(long approvedLeaves) {
        this.approvedLeaves = approvedLeaves;
    }

    public long getRejectedLeaves() {
        return rejectedLeaves;
    }

    public void setRejectedLeaves(long rejectedLeaves) {
        this.rejectedLeaves = rejectedLeaves;
    }

    public int getMyPaidLeaveTotal() {
        return myPaidLeaveTotal;
    }

    public void setMyPaidLeaveTotal(int myPaidLeaveTotal) {
        this.myPaidLeaveTotal = myPaidLeaveTotal;
    }

    public int getMyPaidLeaveUsed() {
        return myPaidLeaveUsed;
    }

    public void setMyPaidLeaveUsed(int myPaidLeaveUsed) {
        this.myPaidLeaveUsed = myPaidLeaveUsed;
    }

    public int getMyPaidLeaveRemaining() {
        return myPaidLeaveRemaining;
    }

    public void setMyPaidLeaveRemaining(int myPaidLeaveRemaining) {
        this.myPaidLeaveRemaining = myPaidLeaveRemaining;
    }

    public long getMyPendingLeaves() {
        return myPendingLeaves;
    }

    public void setMyPendingLeaves(long myPendingLeaves) {
        this.myPendingLeaves = myPendingLeaves;
    }

    public long getMyApprovedLeaves() {
        return myApprovedLeaves;
    }

    public void setMyApprovedLeaves(long myApprovedLeaves) {
        this.myApprovedLeaves = myApprovedLeaves;
    }

    public long getMyRejectedLeaves() {
        return myRejectedLeaves;
    }

    public void setMyRejectedLeaves(long myRejectedLeaves) {
        this.myRejectedLeaves = myRejectedLeaves;
    }

    public long getMyPresentDays() {
        return myPresentDays;
    }

    public void setMyPresentDays(long myPresentDays) {
        this.myPresentDays = myPresentDays;
    }

    public long getMyAbsentDays() {
        return myAbsentDays;
    }

    public void setMyAbsentDays(long myAbsentDays) {
        this.myAbsentDays = myAbsentDays;
    }

    public long getMyLeaveDays() {
        return myLeaveDays;
    }

    public void setMyLeaveDays(long myLeaveDays) {
        this.myLeaveDays = myLeaveDays;
    }

    public double getMyAttendancePercentage() {
        return myAttendancePercentage;
    }

    public void setMyAttendancePercentage(double myAttendancePercentage) {
        this.myAttendancePercentage = myAttendancePercentage;
    }

    public AttendanceResponseDto getTodayAttendance() {
        return todayAttendance;
    }

    public void setTodayAttendance(AttendanceResponseDto todayAttendance) {
        this.todayAttendance = todayAttendance;
    }

    public Map<String, Long> getDepartmentBreakdown() {
        return departmentBreakdown;
    }

    public void setDepartmentBreakdown(Map<String, Long> departmentBreakdown) {
        this.departmentBreakdown = departmentBreakdown;
    }
}
