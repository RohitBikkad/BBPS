package com.bbps.controller;

import com.bbps.dto.StaffDto;
import com.bbps.model.AccountStatus;
import com.bbps.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<List<StaffDto>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/supervisors")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<List<StaffDto>> getSupervisors() {
        return ResponseEntity.ok(staffService.getSupervisors());
    }

    @GetMapping("/{employeeId}")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'SUPERVISOR')")
    public ResponseEntity<StaffDto> getStaffById(@PathVariable String employeeId) {
        return ResponseEntity.ok(staffService.getStaffByEmployeeId(employeeId));
    }

    @PostMapping
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<StaffDto> createStaff(@Valid @RequestBody StaffDto dto) {
        return ResponseEntity.ok(staffService.createStaff(dto));
    }

    @PutMapping("/{employeeId}")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<StaffDto> updateStaff(@PathVariable String employeeId, @Valid @RequestBody StaffDto dto) {
        return ResponseEntity.ok(staffService.updateStaff(employeeId, dto));
    }

    @PatchMapping("/{employeeId}/status")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<StaffDto> toggleStatus(@PathVariable String employeeId, @RequestParam AccountStatus status) {
        return ResponseEntity.ok(staffService.toggleStatus(employeeId, status));
    }

    @PatchMapping("/{employeeId}/assign-supervisor")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<Map<String, String>> assignSupervisor(@PathVariable String employeeId, @RequestParam String supervisorEmployeeId) {
        staffService.assignSupervisor(employeeId, supervisorEmployeeId);
        return ResponseEntity.ok(Map.of("message", "Supervisor assigned successfully"));
    }

    @PostMapping("/{employeeId}/reset-password")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<Map<String, String>> resetPassword(@PathVariable String employeeId, @RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters"));
        }
        staffService.resetPassword(employeeId, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
}
