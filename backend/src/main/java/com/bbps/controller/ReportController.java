package com.bbps.controller;

import com.bbps.dto.AttendanceResponseDto;
import com.bbps.dto.LeaveResponseDto;
import com.bbps.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasAnyRole('PRINCIPAL', 'SUPERVISOR')")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceResponseDto>> getAttendanceReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String supervisorId,
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(reportService.getFilteredAttendance(startDate, endDate, employeeId, department, supervisorId, status));
    }

    @GetMapping("/attendance/export/excel")
    public ResponseEntity<byte[]> exportAttendanceExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String supervisorId,
            @RequestParam(required = false) String status) throws IOException {

        List<AttendanceResponseDto> list = reportService.getFilteredAttendance(startDate, endDate, employeeId, department, supervisorId, status);
        byte[] excelBytes = reportService.generateAttendanceExcel(list);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bbps_attendance_report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }

    @GetMapping("/attendance/export/csv")
    public ResponseEntity<byte[]> exportAttendanceCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String supervisorId,
            @RequestParam(required = false) String status) {

        List<AttendanceResponseDto> list = reportService.getFilteredAttendance(startDate, endDate, employeeId, department, supervisorId, status);
        byte[] csvBytes = reportService.generateAttendanceCsv(list);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bbps_attendance_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveResponseDto>> getLeaveReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String leaveType,
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(reportService.getFilteredLeaves(startDate, endDate, employeeId, department, leaveType, status));
    }

    @GetMapping("/leaves/export/csv")
    public ResponseEntity<byte[]> exportLeaveCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String leaveType,
            @RequestParam(required = false) String status) {

        List<LeaveResponseDto> list = reportService.getFilteredLeaves(startDate, endDate, employeeId, department, leaveType, status);
        byte[] csvBytes = reportService.generateLeaveCsv(list);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bbps_leave_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }
}
