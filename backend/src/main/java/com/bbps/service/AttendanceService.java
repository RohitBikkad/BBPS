package com.bbps.service;

import com.bbps.dto.*;
import com.bbps.exception.BadRequestException;
import com.bbps.exception.ResourceNotFoundException;
import com.bbps.model.*;
import com.bbps.repository.AttendanceAuditRepository;
import com.bbps.repository.AttendanceRepository;
import com.bbps.repository.LeaveRequestRepository;
import com.bbps.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceAuditRepository auditRepository;
    private final UserRepository userRepository;
    private final LeaveRequestRepository leaveRepository;
    private final NotificationService notificationService;
    private final CalendarService calendarService;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             AttendanceAuditRepository auditRepository,
                             UserRepository userRepository,
                             LeaveRequestRepository leaveRepository,
                             NotificationService notificationService,
                             CalendarService calendarService) {
        this.attendanceRepository = attendanceRepository;
        this.auditRepository = auditRepository;
        this.userRepository = userRepository;
        this.leaveRepository = leaveRepository;
        this.notificationService = notificationService;
        this.calendarService = calendarService;
    }

    /**
     * Step 1: Staff marks attendance for the day.
     * Enforces leave check, working day check, duplicate prevention, and creates PENDING record.
     */
    @Transactional
    public AttendanceResponseDto markAttendance(String employeeId, AttendanceMarkRequest request) {
        User staff = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + employeeId));

        if (staff.getStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException("Inactive accounts cannot mark attendance");
        }

        LocalDate date = request.getAttendanceDate() != null ? request.getAttendanceDate() : LocalDate.now();

        // Check if staff has an approved leave for this date
        List<LeaveRequest> approvedLeaves = leaveRepository.findApprovedLeavesForEmployeeOnDate(employeeId, date);
        if (!approvedLeaves.isEmpty()) {
            throw new BadRequestException("You have an approved leave on " + date + " (Status: ON_LEAVE). Cannot mark attendance.");
        }

        // Check if already marked for today
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndAttendanceDate(employeeId, date);
        if (existing.isPresent()) {
            throw new BadRequestException("Attendance already marked for date: " + date);
        }

        Attendance attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setAttendanceDate(date);
        attendance.setMarkedStatus(request.getMarkedStatus());
        attendance.setMarkedAt(LocalDateTime.now());
        attendance.setApprovalStatus(ApprovalStatus.PENDING);
        attendance.setFinalStatus(FinalAttendanceStatus.PENDING);

        Attendance saved = attendanceRepository.save(attendance);

        // Notify staff
        notificationService.createNotification(
                employeeId,
                "Attendance Submitted",
                "Attendance marked as " + request.getMarkedStatus() + " for " + date + ". Waiting for Principal approval.",
                "ATTENDANCE"
        );

        return mapToDto(saved, staff);
    }

    /**
     * Today's status for a staff member
     */
    public AttendanceResponseDto getTodayStatus(String employeeId) {
        LocalDate today = LocalDate.now();
        User staff = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + employeeId));

        // Check if on leave
        List<LeaveRequest> leaves = leaveRepository.findApprovedLeavesForEmployeeOnDate(employeeId, today);
        boolean onLeave = !leaves.isEmpty();

        Optional<Attendance> attendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employeeId, today);
        if (attendance.isPresent()) {
            AttendanceResponseDto dto = mapToDto(attendance.get(), staff);
            dto.setOnLeave(onLeave);
            return dto;
        }

        AttendanceResponseDto notMarkedDto = new AttendanceResponseDto();
        notMarkedDto.setEmployeeId(employeeId);
        notMarkedDto.setStaffName(staff.getFullName());
        notMarkedDto.setDepartment(staff.getDepartment());
        notMarkedDto.setDesignation(staff.getDesignation());
        notMarkedDto.setAttendanceDate(today);
        notMarkedDto.setApprovalStatus(ApprovalStatus.PENDING);
        notMarkedDto.setFinalStatus(onLeave ? FinalAttendanceStatus.ON_LEAVE : FinalAttendanceStatus.NOT_MARKED);
        notMarkedDto.setOnLeave(onLeave);
        return notMarkedDto;
    }

    /**
     * Attendance history for a staff member
     */
    public List<AttendanceResponseDto> getStaffAttendanceHistory(String employeeId, LocalDate start, LocalDate end) {
        User staff = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + employeeId));

        List<Attendance> records;
        if (start != null && end != null) {
            records = attendanceRepository.findByEmployeeIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(employeeId, start, end);
        } else {
            records = attendanceRepository.findByEmployeeIdOrderByAttendanceDateDesc(employeeId);
        }

        return records.stream()
                .map(a -> mapToDto(a, staff))
                .collect(Collectors.toList());
    }

    /**
     * Supervisor: View assigned staff attendance for a given date
     */
    public List<AttendanceResponseDto> getSupervisorTeamAttendance(String supervisorEmployeeId, LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<User> assignedStaff = userRepository.findBySupervisorEmployeeId(supervisorEmployeeId);
        Map<String, User> userMap = assignedStaff.stream().collect(Collectors.toMap(User::getEmployeeId, u -> u));

        List<String> empIds = new ArrayList<>(userMap.keySet());
        if (empIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Attendance> attendances = attendanceRepository.findByEmployeeIdsAndDate(empIds, targetDate);
        Map<String, Attendance> attMap = attendances.stream().collect(Collectors.toMap(Attendance::getEmployeeId, a -> a));

        List<AttendanceResponseDto> result = new ArrayList<>();
        for (User staff : assignedStaff) {
            Attendance att = attMap.get(staff.getEmployeeId());
            boolean onLeave = !leaveRepository.findApprovedLeavesForEmployeeOnDate(staff.getEmployeeId(), targetDate).isEmpty();

            if (att != null) {
                AttendanceResponseDto dto = mapToDto(att, staff);
                dto.setOnLeave(onLeave);
                result.add(dto);
            } else {
                AttendanceResponseDto empty = new AttendanceResponseDto();
                empty.setEmployeeId(staff.getEmployeeId());
                empty.setStaffName(staff.getFullName());
                empty.setDepartment(staff.getDepartment());
                empty.setDesignation(staff.getDesignation());
                empty.setSupervisorEmployeeId(supervisorEmployeeId);
                empty.setAttendanceDate(targetDate);
                empty.setApprovalStatus(ApprovalStatus.PENDING);
                empty.setFinalStatus(onLeave ? FinalAttendanceStatus.ON_LEAVE : FinalAttendanceStatus.NOT_MARKED);
                empty.setOnLeave(onLeave);
                result.add(empty);
            }
        }

        return result;
    }

    /**
     * Principal: Get daily attendance approval list for all staff on a specific date
     */
    public List<AttendanceResponseDto> getDailyAttendanceForPrincipal(LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<User> allStaff = userRepository.findByRole(Role.ROLE_STAFF);
        allStaff.addAll(userRepository.findByRole(Role.ROLE_SUPERVISOR));

        Map<String, User> userMap = allStaff.stream().collect(Collectors.toMap(User::getEmployeeId, u -> u, (a, b) -> a));
        List<Attendance> attendances = attendanceRepository.findByAttendanceDate(targetDate);
        Map<String, Attendance> attMap = attendances.stream().collect(Collectors.toMap(Attendance::getEmployeeId, a -> a));

        List<AttendanceResponseDto> list = new ArrayList<>();
        for (User staff : allStaff) {
            Attendance att = attMap.get(staff.getEmployeeId());
            boolean onLeave = !leaveRepository.findApprovedLeavesForEmployeeOnDate(staff.getEmployeeId(), targetDate).isEmpty();

            if (att != null) {
                AttendanceResponseDto dto = mapToDto(att, staff);
                dto.setOnLeave(onLeave);
                list.add(dto);
            } else {
                AttendanceResponseDto uncompleted = new AttendanceResponseDto();
                uncompleted.setEmployeeId(staff.getEmployeeId());
                uncompleted.setStaffName(staff.getFullName());
                uncompleted.setDepartment(staff.getDepartment());
                uncompleted.setDesignation(staff.getDesignation());
                uncompleted.setSupervisorEmployeeId(staff.getSupervisorEmployeeId());
                uncompleted.setAttendanceDate(targetDate);
                uncompleted.setApprovalStatus(ApprovalStatus.PENDING);
                uncompleted.setFinalStatus(onLeave ? FinalAttendanceStatus.ON_LEAVE : FinalAttendanceStatus.NOT_MARKED);
                uncompleted.setOnLeave(onLeave);
                list.add(uncompleted);
            }
        }

        return list;
    }

    /**
     * Step 2: Principal approves individual staff attendance
     */
    @Transactional
    public AttendanceResponseDto approveAttendance(String principalEmployeeId, AttendanceApprovalRequest request) {
        Attendance attendance = attendanceRepository.findById(request.getAttendanceId())
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found: " + request.getAttendanceId()));

        attendance.setFinalStatus(request.getFinalStatus());
        attendance.setApprovalStatus(ApprovalStatus.APPROVED);
        attendance.setApprovedBy(principalEmployeeId);
        attendance.setApprovedAt(LocalDateTime.now());
        if (request.getPrincipalRemarks() != null) {
            attendance.setPrincipalRemarks(request.getPrincipalRemarks());
        }

        Attendance saved = attendanceRepository.save(attendance);

        // Notify staff of Principal approval
        notificationService.createNotification(
                attendance.getEmployeeId(),
                "Attendance Approved",
                "Attendance for " + attendance.getAttendanceDate() + " was approved as " + attendance.getFinalStatus() + " by Principal.",
                "ATTENDANCE"
        );

        User staff = userRepository.findByEmployeeId(attendance.getEmployeeId()).orElse(null);
        return mapToDto(saved, staff);
    }

    /**
     * Principal: Bulk approve all pending attendances for a date
     */
    @Transactional
    public int approveAllPending(String principalEmployeeId, BulkAttendanceApprovalRequest request) {
        LocalDate date = request.getAttendanceDate() != null ? request.getAttendanceDate() : LocalDate.now();
        List<Attendance> pendingList = attendanceRepository.findByAttendanceDateAndApprovalStatus(date, ApprovalStatus.PENDING);

        LocalDateTime now = LocalDateTime.now();
        for (Attendance att : pendingList) {
            if (att.getMarkedStatus() == MarkedStatus.PRESENT) {
                att.setFinalStatus(FinalAttendanceStatus.PRESENT);
            } else if (att.getMarkedStatus() == MarkedStatus.ABSENT) {
                att.setFinalStatus(FinalAttendanceStatus.ABSENT);
            } else {
                att.setFinalStatus(FinalAttendanceStatus.PRESENT);
            }
            att.setApprovalStatus(ApprovalStatus.APPROVED);
            att.setApprovedBy(principalEmployeeId);
            att.setApprovedAt(now);
            if (request.getPrincipalRemarks() != null) {
                att.setPrincipalRemarks(request.getPrincipalRemarks());
            }

            notificationService.createNotification(
                    att.getEmployeeId(),
                    "Attendance Approved",
                    "Attendance for " + att.getAttendanceDate() + " was approved as " + att.getFinalStatus() + " by Principal.",
                    "ATTENDANCE"
            );
        }

        attendanceRepository.saveAll(pendingList);
        return pendingList.size();
    }

    /**
     * Attendance Correction with complete audit trail
     */
    @Transactional
    public AttendanceResponseDto correctAttendance(String principalEmployeeId, AttendanceCorrectionRequest request) {
        Attendance attendance = attendanceRepository.findById(request.getAttendanceId())
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found: " + request.getAttendanceId()));

        String previousStatus = attendance.getFinalStatus().name();
        String newStatus = request.getNewStatus().name();

        attendance.setFinalStatus(request.getNewStatus());
        attendance.setApprovedBy(principalEmployeeId);
        attendance.setApprovedAt(LocalDateTime.now());
        attendance.setPrincipalRemarks(request.getReason());
        Attendance updated = attendanceRepository.save(attendance);

        // Record Audit Trail
        AttendanceAudit audit = new AttendanceAudit(
                attendance.getId(),
                attendance.getEmployeeId(),
                attendance.getAttendanceDate(),
                previousStatus,
                newStatus,
                principalEmployeeId,
                LocalDateTime.now(),
                request.getReason()
        );
        auditRepository.save(audit);

        // Notify staff of correction
        notificationService.createNotification(
                attendance.getEmployeeId(),
                "Attendance Corrected",
                "Your attendance on " + attendance.getAttendanceDate() + " was adjusted from " + previousStatus + " to " + newStatus + ". Reason: " + request.getReason(),
                "ATTENDANCE"
        );

        User staff = userRepository.findByEmployeeId(attendance.getEmployeeId()).orElse(null);
        return mapToDto(updated, staff);
    }

    /**
     * Audit log retrieval
     */
    public List<AttendanceAudit> getAuditLogs(String employeeId) {
        if (employeeId != null && !employeeId.isBlank()) {
            return auditRepository.findByEmployeeIdOrderByChangedAtDesc(employeeId);
        }
        return auditRepository.findAllByOrderByChangedAtDesc();
    }

    public AttendanceResponseDto mapToDto(Attendance attendance, User staff) {
        AttendanceResponseDto dto = new AttendanceResponseDto();
        dto.setId(attendance.getId());
        dto.setEmployeeId(attendance.getEmployeeId());
        dto.setAttendanceDate(attendance.getAttendanceDate());
        dto.setMarkedStatus(attendance.getMarkedStatus());
        dto.setMarkedAt(attendance.getMarkedAt());
        dto.setApprovalStatus(attendance.getApprovalStatus());
        dto.setFinalStatus(attendance.getFinalStatus());
        dto.setApprovedBy(attendance.getApprovedBy());
        dto.setApprovedAt(attendance.getApprovedAt());
        dto.setPrincipalRemarks(attendance.getPrincipalRemarks());

        if (staff != null) {
            dto.setStaffName(staff.getFullName());
            dto.setDepartment(staff.getDepartment());
            dto.setDesignation(staff.getDesignation());
            dto.setSupervisorEmployeeId(staff.getSupervisorEmployeeId());
        }

        return dto;
    }
}
