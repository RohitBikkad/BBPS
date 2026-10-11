package com.bbps.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "leave_year_config")
public class LeaveYearConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "year_name", nullable = false, length = 50)
    private String yearName; // e.g. "2026-2027"

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate; // e.g. 2026-04-01

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate; // e.g. 2027-03-31

    @Column(name = "total_paid_leave_days", nullable = false)
    private Integer totalPaidLeaveDays = 8;

    @Column(name = "is_current", nullable = false)
    private Boolean isCurrent = true;

    public LeaveYearConfig() {
    }

    public LeaveYearConfig(String yearName, LocalDate startDate, LocalDate endDate, Integer totalPaidLeaveDays, Boolean isCurrent) {
        this.yearName = yearName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalPaidLeaveDays = totalPaidLeaveDays;
        this.isCurrent = isCurrent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getYearName() {
        return yearName;
    }

    public void setYearName(String yearName) {
        this.yearName = yearName;
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

    public Integer getTotalPaidLeaveDays() {
        return totalPaidLeaveDays;
    }

    public void setTotalPaidLeaveDays(Integer totalPaidLeaveDays) {
        this.totalPaidLeaveDays = totalPaidLeaveDays;
    }

    public Boolean getIsCurrent() {
        return isCurrent;
    }

    public void setIsCurrent(Boolean isCurrent) {
        this.isCurrent = isCurrent;
    }
}
