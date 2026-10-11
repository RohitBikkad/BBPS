package com.bbps.service;

import com.bbps.dto.AttendanceResponseDto;
import com.bbps.dto.LeaveResponseDto;
import com.bbps.model.Attendance;
import com.bbps.model.LeaveRequest;
import com.bbps.model.User;
import com.bbps.repository.AttendanceRepository;
import com.bbps.repository.LeaveRequestRepository;
import com.bbps.repository.UserRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRepository;
    private final UserRepository userRepository;
    private final AttendanceService attendanceService;
    private final LeaveService leaveService;

    public ReportService(AttendanceRepository attendanceRepository,
                         LeaveRequestRepository leaveRepository,
                         UserRepository userRepository,
                         AttendanceService attendanceService,
                         LeaveService leaveService) {
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
        this.attendanceService = attendanceService;
        this.leaveService = leaveService;
    }

    public List<AttendanceResponseDto> getFilteredAttendance(
            LocalDate startDate, LocalDate endDate,
            String employeeId, String department, String supervisorId, String status) {

        LocalDate start = startDate != null ? startDate : LocalDate.now().minusMonths(1);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        List<Attendance> list = attendanceRepository.findByAttendanceDateBetweenOrderByAttendanceDateDesc(start, end);
        Map<String, User> userMap = userRepository.findAll().stream().collect(Collectors.toMap(User::getEmployeeId, u -> u));

        return list.stream()
                .filter(a -> employeeId == null || employeeId.isBlank() || a.getEmployeeId().equalsIgnoreCase(employeeId))
                .filter(a -> {
                    if (department == null || department.isBlank()) return true;
                    User u = userMap.get(a.getEmployeeId());
                    return u != null && department.equalsIgnoreCase(u.getDepartment());
                })
                .filter(a -> {
                    if (supervisorId == null || supervisorId.isBlank()) return true;
                    User u = userMap.get(a.getEmployeeId());
                    return u != null && supervisorId.equalsIgnoreCase(u.getSupervisorEmployeeId());
                })
                .filter(a -> {
                    if (status == null || status.isBlank()) return true;
                    return a.getFinalStatus().name().equalsIgnoreCase(status);
                })
                .map(a -> attendanceService.mapToDto(a, userMap.get(a.getEmployeeId())))
                .collect(Collectors.toList());
    }

    public List<LeaveResponseDto> getFilteredLeaves(
            LocalDate startDate, LocalDate endDate,
            String employeeId, String department, String leaveType, String status) {

        List<LeaveRequest> list = leaveRepository.findAllByOrderByCreatedAtDesc();
        Map<String, User> userMap = userRepository.findAll().stream().collect(Collectors.toMap(User::getEmployeeId, u -> u));

        return list.stream()
                .filter(l -> {
                    if (startDate != null && l.getStartDate().isBefore(startDate)) return false;
                    if (endDate != null && l.getEndDate().isAfter(endDate)) return false;
                    return true;
                })
                .filter(l -> employeeId == null || employeeId.isBlank() || l.getEmployeeId().equalsIgnoreCase(employeeId))
                .filter(l -> {
                    if (department == null || department.isBlank()) return true;
                    User u = userMap.get(l.getEmployeeId());
                    return u != null && department.equalsIgnoreCase(u.getDepartment());
                })
                .filter(l -> leaveType == null || leaveType.isBlank() || l.getLeaveType().name().equalsIgnoreCase(leaveType))
                .filter(l -> status == null || status.isBlank() || l.getFinalStatus().name().equalsIgnoreCase(status))
                .map(l -> leaveService.mapToDto(l, userMap.get(l.getEmployeeId())))
                .collect(Collectors.toList());
    }

    public byte[] generateAttendanceExcel(List<AttendanceResponseDto> records) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Attendance Report");

            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_TURQUOISE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] columns = {"Date", "Employee ID", "Staff Name", "Department", "Designation", "Marked Status", "Final Status", "Approval Status", "Approved By", "Remarks"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (AttendanceResponseDto a : records) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(a.getAttendanceDate() != null ? a.getAttendanceDate().toString() : "");
                row.createCell(1).setCellValue(a.getEmployeeId());
                row.createCell(2).setCellValue(a.getStaffName() != null ? a.getStaffName() : "");
                row.createCell(3).setCellValue(a.getDepartment() != null ? a.getDepartment() : "");
                row.createCell(4).setCellValue(a.getDesignation() != null ? a.getDesignation() : "");
                row.createCell(5).setCellValue(a.getMarkedStatus() != null ? a.getMarkedStatus().name() : "-");
                row.createCell(6).setCellValue(a.getFinalStatus() != null ? a.getFinalStatus().name() : "-");
                row.createCell(7).setCellValue(a.getApprovalStatus() != null ? a.getApprovalStatus().name() : "-");
                row.createCell(8).setCellValue(a.getApprovedBy() != null ? a.getApprovedBy() : "");
                row.createCell(9).setCellValue(a.getPrincipalRemarks() != null ? a.getPrincipalRemarks() : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] generateAttendanceCsv(List<AttendanceResponseDto> records) {
        StringBuilder sb = new StringBuilder();
        sb.append("Date,Employee ID,Staff Name,Department,Designation,Marked Status,Final Status,Approval Status,Approved By,Remarks\n");

        for (AttendanceResponseDto a : records) {
            sb.append(escapeCsv(a.getAttendanceDate() != null ? a.getAttendanceDate().toString() : "")).append(",");
            sb.append(escapeCsv(a.getEmployeeId())).append(",");
            sb.append(escapeCsv(a.getStaffName())).append(",");
            sb.append(escapeCsv(a.getDepartment())).append(",");
            sb.append(escapeCsv(a.getDesignation())).append(",");
            sb.append(escapeCsv(a.getMarkedStatus() != null ? a.getMarkedStatus().name() : "-")).append(",");
            sb.append(escapeCsv(a.getFinalStatus() != null ? a.getFinalStatus().name() : "-")).append(",");
            sb.append(escapeCsv(a.getApprovalStatus() != null ? a.getApprovalStatus().name() : "-")).append(",");
            sb.append(escapeCsv(a.getApprovedBy())).append(",");
            sb.append(escapeCsv(a.getPrincipalRemarks())).append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] generateLeaveCsv(List<LeaveResponseDto> records) {
        StringBuilder sb = new StringBuilder();
        sb.append("Leave ID,Employee ID,Staff Name,Department,Leave Type,Start Date,End Date,Total Days,Paid Days,Unpaid Days,Final Status,Supervisor Status,Principal Status,Reason\n");

        for (LeaveResponseDto l : records) {
            sb.append(l.getId()).append(",");
            sb.append(escapeCsv(l.getEmployeeId())).append(",");
            sb.append(escapeCsv(l.getStaffName())).append(",");
            sb.append(escapeCsv(l.getDepartment())).append(",");
            sb.append(escapeCsv(l.getLeaveType() != null ? l.getLeaveType().name() : "")).append(",");
            sb.append(escapeCsv(l.getStartDate() != null ? l.getStartDate().toString() : "")).append(",");
            sb.append(escapeCsv(l.getEndDate() != null ? l.getEndDate().toString() : "")).append(",");
            sb.append(l.getTotalDays()).append(",");
            sb.append(l.getPaidDays()).append(",");
            sb.append(l.getUnpaidDays()).append(",");
            sb.append(escapeCsv(l.getFinalStatus() != null ? l.getFinalStatus().name() : "")).append(",");
            sb.append(escapeCsv(l.getSupervisorStatus() != null ? l.getSupervisorStatus().name() : "")).append(",");
            sb.append(escapeCsv(l.getPrincipalStatus() != null ? l.getPrincipalStatus().name() : "")).append(",");
            sb.append(escapeCsv(l.getReason())).append("\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsv(String val) {
        if (val == null) return "\"\"";
        return "\"" + val.replace("\"", "\"\"") + "\"";
    }
}
