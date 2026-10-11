package com.bbps.controller;

import com.bbps.dto.*;
import com.bbps.model.AttendanceAudit;
import com.bbps.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    /**
     * Staff: Mark daily attendance
     */
    @PostMapping("/mark")
    public ResponseEntity<AttendanceResponseDto> markAttendance(
            Authentication auth,
            @Valid @RequestBody AttendanceMarkRequest request) {
        return ResponseEntity.ok(attendanceService.markAttendance(auth.getName(), request));
    }

    /**
     * Staff: Get today's attendance status
     */
    @GetMapping("/my-status")
    public ResponseEntity<AttendanceResponseDto> getMyTodayStatus(Authentication auth) {
        return ResponseEntity.ok(attendanceService.getTodayStatus(auth.getName()));
    }

    /**
     * Staff: Get own attendance history
     */
    @GetMapping("/my-history")
    public ResponseEntity<List<AttendanceResponseDto>> getMyHistory(
            Authentication auth,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getStaffAttendanceHistory(auth.getName(), startDate, endDate));
    }

    /**
     * Supervisor: Get assigned team's attendance for a date
     */
    @GetMapping("/supervisor/team")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<List<AttendanceResponseDto>> getSupervisorTeam(
            Authentication auth,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getSupervisorTeamAttendance(auth.getName(), date));
    }

    /**
     * Principal: View daily attendance approval list for all staff
     */
    @GetMapping("/approval/daily")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<List<AttendanceResponseDto>> getDailyAttendanceForPrincipal(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getDailyAttendanceForPrincipal(date));
    }

    /**
     * Principal: Approve individual attendance record
     */
    @PostMapping("/approval/single")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<AttendanceResponseDto> approveSingleAttendance(
            Authentication auth,
            @Valid @RequestBody AttendanceApprovalRequest request) {
        return ResponseEntity.ok(attendanceService.approveAttendance(auth.getName(), request));
    }

    /**
     * Principal: Bulk approve all pending attendances for a date
     */
    @PostMapping("/approval/bulk")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<Map<String, Object>> bulkApprove(
            Authentication auth,
            @Valid @RequestBody BulkAttendanceApprovalRequest request) {
        int count = attendanceService.approveAllPending(auth.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Approved all pending attendance records", "count", count));
    }

    /**
     * Principal: Correct attendance with mandatory audit trail
     */
    @PostMapping("/correct")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<AttendanceResponseDto> correctAttendance(
            Authentication auth,
            @Valid @RequestBody AttendanceCorrectionRequest request) {
        return ResponseEntity.ok(attendanceService.correctAttendance(auth.getName(), request));
    }

    /**
     * Principal: View audit trail of attendance corrections
     */
    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<List<AttendanceAudit>> getAuditLogs(
            @RequestParam(required = false) String employeeId) {
        return ResponseEntity.ok(attendanceService.getAuditLogs(employeeId));
    }
}
