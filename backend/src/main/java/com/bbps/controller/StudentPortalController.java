package com.bbps.controller;

import com.bbps.dto.GuestPickupPassRequest;
import com.bbps.dto.ParentDashboardDto;
import com.bbps.dto.QuickCareLogRequest;
import com.bbps.dto.StudentLeaveApplyRequest;
import com.bbps.model.*;
import com.bbps.service.StudentPortalService;
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
@RequestMapping("/api/student-portal")
public class StudentPortalController {

    private final StudentPortalService studentPortalService;

    public StudentPortalController(StudentPortalService studentPortalService) {
        this.studentPortalService = studentPortalService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ParentDashboardDto> getDashboard(
            @RequestParam(required = false) Long studentId,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "parent1@bbps.edu";
        ParentDashboardDto dashboard = studentPortalService.getParentDashboard(username, studentId);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/students/{studentId}/history")
    public ResponseEntity<List<StudentDailyCareLog>> getHistory(@PathVariable Long studentId) {
        List<StudentDailyCareLog> logs = studentPortalService.getRecentLogs(studentId);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/pickups/guest-pass")
    public ResponseEntity<AuthorizedPickup> createGuestPass(
            @Valid @RequestBody GuestPickupPassRequest request,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "parent1@bbps.edu";
        AuthorizedPickup pass = studentPortalService.createGuestPickupPass(username, request);
        return ResponseEntity.ok(pass);
    }

    @PostMapping("/leaves")
    public ResponseEntity<StudentLeaveRequest> applyLeave(
            @Valid @RequestBody StudentLeaveApplyRequest request,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "parent1@bbps.edu";
        StudentLeaveRequest leave = studentPortalService.applyStudentLeave(username, request);
        return ResponseEntity.ok(leave);
    }

    @PostMapping("/teacher/quick-log")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<StudentDailyCareLog> updateQuickLog(
            @Valid @RequestBody QuickCareLogRequest request,
            Authentication authentication) {
        String staffId = authentication != null ? authentication.getName() : "STAFF";
        StudentDailyCareLog log = studentPortalService.quickUpdateCareLog(staffId, request);
        return ResponseEntity.ok(log);
    }

    @GetMapping("/teacher/class-sheet")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<Map<String, Object>> getClassSheet(
            @RequestParam(defaultValue = "Nursery") String grade,
            @RequestParam(defaultValue = "Butterflies") String section,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Map<String, Object> sheet = studentPortalService.getClassDailySheet(grade, section, date);
        return ResponseEntity.ok(sheet);
    }

    @PostMapping("/teacher/moment")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<StudentMoment> createMoment(
            @RequestBody StudentMoment moment,
            Authentication authentication) {
        String staffId = authentication != null ? authentication.getName() : "STAFF";
        StudentMoment saved = studentPortalService.createMoment(moment, staffId);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/teacher/reminder")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<PackTomorrowReminder> createReminder(
            @RequestBody PackTomorrowReminder reminder,
            Authentication authentication) {
        String staffId = authentication != null ? authentication.getName() : "STAFF";
        PackTomorrowReminder saved = studentPortalService.createReminder(reminder, staffId);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/teacher/students")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<Student> addStudent(
            @RequestBody Student student) {
        Student saved = studentPortalService.addStudent(student);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/teacher/milestones")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<DevelopmentalMilestone> awardMilestone(
            @RequestBody DevelopmentalMilestone milestone) {
        DevelopmentalMilestone saved = studentPortalService.awardMilestone(milestone);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/teacher/leaves")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<List<StudentLeaveRequest>> getAllStudentLeaves() {
        return ResponseEntity.ok(studentPortalService.getAllStudentLeaves());
    }

    @PatchMapping("/teacher/leaves/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<StudentLeaveRequest> updateLeaveStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        String staffId = authentication != null ? authentication.getName() : "STAFF";
        String status = body.getOrDefault("status", "APPROVED");
        String remarks = body.getOrDefault("remarks", "Approved by Class Mother Teacher");
        StudentLeaveRequest updated = studentPortalService.updateLeaveStatus(id, status, remarks, staffId);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/teacher/bulk-attendance")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERVISOR', 'PRINCIPAL')")
    public ResponseEntity<List<StudentDailyCareLog>> bulkAttendance(
            @RequestBody Map<String, Object> req,
            Authentication authentication) {
        String staffId = authentication != null ? authentication.getName() : "STAFF";
        String grade = (String) req.getOrDefault("grade", "Nursery");
        String section = (String) req.getOrDefault("section", "Butterflies");
        String status = (String) req.getOrDefault("status", "PRESENT");
        String checkInTime = (String) req.getOrDefault("checkInTime", "08:40 AM");
        List<StudentDailyCareLog> logs = studentPortalService.bulkAttendance(grade, section, LocalDate.now(), status, checkInTime, staffId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentPortalService.getAllStudents());
    }
}
