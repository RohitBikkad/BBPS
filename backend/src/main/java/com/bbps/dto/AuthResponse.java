package com.bbps.dto;

import com.bbps.model.AccountStatus;
import com.bbps.model.Role;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String employeeId;
    private String fullName;
    private String email;
    private Role role;
    private AccountStatus status;
    private String department;
    private String designation;
    private String supervisorEmployeeId;
    private Integer paidLeaveBalance;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long id, String employeeId, String fullName, String email,
                        Role role, AccountStatus status, String department, String designation,
                        String supervisorEmployeeId, Integer paidLeaveBalance) {
        this.token = token;
        this.id = id;
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
        this.department = department;
        this.designation = designation;
        this.supervisorEmployeeId = supervisorEmployeeId;
        this.paidLeaveBalance = paidLeaveBalance;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
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

    public Integer getPaidLeaveBalance() {
        return paidLeaveBalance;
    }

    public void setPaidLeaveBalance(Integer paidLeaveBalance) {
        this.paidLeaveBalance = paidLeaveBalance;
    }
}
