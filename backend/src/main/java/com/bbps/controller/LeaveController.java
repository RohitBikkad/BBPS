package com.bbps.controller;

import com.bbps.dto.*;
import com.bbps.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    /**
     * Preview calculation before submission (Paid vs Unpaid days breakdown)
     */
    @GetMapping("/preview")
    public ResponseEntity<LeavePreviewResponse> previewLeave(
            Authentication auth,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(leaveService.previewLeave(auth.getName(), startDate, endDate));
    }

    /**
     * Staff: Apply for leave
     */
    @PostMapping("/apply")
    public ResponseEntity<LeaveResponseDto> applyLeave(
            Authentication auth,
            @Valid @RequestBody LeaveApplyRequest request) {
        return ResponseEntity.ok(leaveService.applyLeave(auth.getName(), request));
    }

    /**
     * Staff: View my leave applications
     */
    @GetMapping("/my-leaves")
    public ResponseEntity<List<LeaveResponseDto>> getMyLeaves(Authentication auth) {
        return ResponseEntity.ok(leaveService.getStaffLeaves(auth.getName()));
    }

    /**
     * Staff: Cancel pending leave
     */
    @PostMapping("/cancel/{leaveId}")
    public ResponseEntity<LeaveResponseDto> cancelLeave(
            Authentication auth,
            @PathVariable Long leaveId) {
        return ResponseEntity.ok(leaveService.cancelLeave(auth.getName(), leaveId));
    }

    /**
     * Supervisor: View team leaves
     */
    @GetMapping("/supervisor/team-leaves")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<List<LeaveResponseDto>> getSupervisorTeamLeaves(Authentication auth) {
        return ResponseEntity.ok(leaveService.getSupervisorTeamLeaves(auth.getName()));
    }

    /**
     * Supervisor: Recommend or reject leave
     */
    @PostMapping("/supervisor/review")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<LeaveResponseDto> supervisorReview(
            Authentication auth,
            @Valid @RequestBody LeaveReviewRequest request) {
        return ResponseEntity.ok(leaveService.supervisorReview(auth.getName(), request));
    }

    /**
     * Principal: View all leaves
     */
    @GetMapping("/principal/all")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<List<LeaveResponseDto>> getAllLeavesForPrincipal() {
        return ResponseEntity.ok(leaveService.getAllLeavesForPrincipal());
    }

    /**
     * Principal: Final approval or rejection
     */
    @PostMapping("/principal/review")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<LeaveResponseDto> principalReview(
            Authentication auth,
            @Valid @RequestBody LeaveReviewRequest request) {
        return ResponseEntity.ok(leaveService.principalFinalDecision(auth.getName(), request));
    }
}
