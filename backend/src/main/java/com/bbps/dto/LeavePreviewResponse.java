package com.bbps.dto;

import java.time.LocalDate;

public class LeavePreviewResponse {
    private LocalDate startDate;
    private LocalDate endDate;
    private int totalDays;
    private int currentPaidBalance;
    private int paidDays;
    private int unpaidDays;
    private int remainingPaidBalanceAfter;
    private boolean valid;
    private String message;

    public LeavePreviewResponse() {
    }

    public LeavePreviewResponse(LocalDate startDate, LocalDate endDate, int totalDays,
                                int currentPaidBalance, int paidDays, int unpaidDays,
                                int remainingPaidBalanceAfter, boolean valid, String message) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalDays = totalDays;
        this.currentPaidBalance = currentPaidBalance;
        this.paidDays = paidDays;
        this.unpaidDays = unpaidDays;
        this.remainingPaidBalanceAfter = remainingPaidBalanceAfter;
        this.valid = valid;
        this.message = message;
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

    public int getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(int totalDays) {
        this.totalDays = totalDays;
    }

    public int getCurrentPaidBalance() {
        return currentPaidBalance;
    }

    public void setCurrentPaidBalance(int currentPaidBalance) {
        this.currentPaidBalance = currentPaidBalance;
    }

    public int getPaidDays() {
        return paidDays;
    }

    public void setPaidDays(int paidDays) {
        this.paidDays = paidDays;
    }

    public int getUnpaidDays() {
        return unpaidDays;
    }

    public void setUnpaidDays(int unpaidDays) {
        this.unpaidDays = unpaidDays;
    }

    public int getRemainingPaidBalanceAfter() {
        return remainingPaidBalanceAfter;
    }

    public void setRemainingPaidBalanceAfter(int remainingPaidBalanceAfter) {
        this.remainingPaidBalanceAfter = remainingPaidBalanceAfter;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
