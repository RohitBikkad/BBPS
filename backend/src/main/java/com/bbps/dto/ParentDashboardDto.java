package com.bbps.dto;

import com.bbps.model.*;
import java.util.List;

public class ParentDashboardDto {
    private Student student;
    private List<Student> siblings;
    private StudentDailyCareLog todayLog;
    private List<StudentDailyCareLog> recentLogs;
    private List<StudentMoment> recentMoments;
    private List<AuthorizedPickup> authorizedPickups;
    private List<DevelopmentalMilestone> milestones;
    private List<StudentLeaveRequest> recentLeaves;
    private List<StudentFeeRecord> feeRecords;
    private PackTomorrowReminder tomorrowReminder;

    public ParentDashboardDto() {}

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public List<Student> getSiblings() { return siblings; }
    public void setSiblings(List<Student> siblings) { this.siblings = siblings; }

    public StudentDailyCareLog getTodayLog() { return todayLog; }
    public void setTodayLog(StudentDailyCareLog todayLog) { this.todayLog = todayLog; }

    public List<StudentDailyCareLog> getRecentLogs() { return recentLogs; }
    public void setRecentLogs(List<StudentDailyCareLog> recentLogs) { this.recentLogs = recentLogs; }

    public List<StudentMoment> getRecentMoments() { return recentMoments; }
    public void setRecentMoments(List<StudentMoment> recentMoments) { this.recentMoments = recentMoments; }

    public List<AuthorizedPickup> getAuthorizedPickups() { return authorizedPickups; }
    public void setAuthorizedPickups(List<AuthorizedPickup> authorizedPickups) { this.authorizedPickups = authorizedPickups; }

    public List<DevelopmentalMilestone> getMilestones() { return milestones; }
    public void setMilestones(List<DevelopmentalMilestone> milestones) { this.milestones = milestones; }

    public List<StudentLeaveRequest> getRecentLeaves() { return recentLeaves; }
    public void setRecentLeaves(List<StudentLeaveRequest> recentLeaves) { this.recentLeaves = recentLeaves; }

    public List<StudentFeeRecord> getFeeRecords() { return feeRecords; }
    public void setFeeRecords(List<StudentFeeRecord> feeRecords) { this.feeRecords = feeRecords; }

    public PackTomorrowReminder getTomorrowReminder() { return tomorrowReminder; }
    public void setTomorrowReminder(PackTomorrowReminder tomorrowReminder) { this.tomorrowReminder = tomorrowReminder; }
}
