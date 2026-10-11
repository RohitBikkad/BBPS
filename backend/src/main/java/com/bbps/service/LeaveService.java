package com.bbps.service;

import com.bbps.dto.*;
import com.bbps.exception.BadRequestException;
import com.bbps.exception.ResourceNotFoundException;
import com.bbps.model.*;
import com.bbps.repository.AttendanceRepository;
import com.bbps.repository.LeaveRequestRepository;
import com.bbps.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final NotificationService notificationService;

    public LeaveService(LeaveRequestRepository leaveRepository,
                        UserRepository userRepository,
                        AttendanceRepository attendanceRepository,
                        NotificationService notificationService) {
        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
        this.attendanceRepository = attendanceRepository;
        this.notificationService = notificationService;
    }

    /**
     * Preview leave calculation (Paid vs Unpaid days breakdown)
     */
    public LeavePreviewResponse previewLeave(String employeeId, LocalDate startDate, LocalDate endDate) {
        User staff = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + employeeId));

        if (startDate == null || endDate == null) {
            throw new BadRequestException("Start and End dates are required");
        }
        if (endDate.isBefore(startDate)) {
            throw new BadRequestException("End date cannot be before Start date");
        }

        int totalDays = (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
        int currentBalance = staff.getPaidLeaveBalance();

        int paidDays = Math.min(totalDays, Math.max(0, currentBalance));
        int unpaidDays = totalDays - paidDays;
        int remainingAfter = currentBalance - paidDays;

        String message = String.format("Requesting %d day(s): %d Paid Day(s), %d Unpaid Day(s). Balance after approval: %d",
                totalDays, paidDays, unpaidDays, remainingAfter);

        return new LeavePreviewResponse(
                startDate,
                endDate,
                totalDays,
                currentBalance,
                paidDays,
                unpaidDays,
                remainingAfter,
                true,
                message
        );
    }

    /**
     * Staff applies for leave
     */
    @Transactional
    public LeaveResponseDto applyLeave(String employeeId, LeaveApplyRequest request) {
        User staff = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + employeeId));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before Start date");
        }

        // Check for overlapping active leaves
        List<LeaveRequest> overlapping = leaveRepository.findOverlappingLeaves(employeeId, request.getStartDate(), request.getEndDate());
        if (!overlapping.isEmpty()) {
            throw new BadRequestException("You already have an existing or pending leave application for this date range");
        }

        int totalDays = (int) ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        int currentBalance = staff.getPaidLeaveBalance();

        // Calculate paid vs unpaid
        int paidDays = 0;
        int unpaidDays = totalDays;

        if (request.getLeaveType() != LeaveType.UNPAID) {
            paidDays = Math.min(totalDays, Math.max(0, currentBalance));
            unpaidDays = totalDays - paidDays;
        }

        LeaveRequest leave = new LeaveRequest();
        leave.setEmployeeId(employeeId);
        leave.setLeaveType(request.getLeaveType());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setTotalDays(totalDays);
        leave.setPaidDays(paidDays);
        leave.setUnpaidDays(unpaidDays);
        leave.setReason(request.getReason());
        leave.setAttachmentUrl(request.getAttachmentUrl());
        leave.setSupervisorStatus(ApprovalStatus.PENDING);
        leave.setPrincipalStatus(ApprovalStatus.PENDING);
        leave.setFinalStatus(LeaveStatus.PENDING);

        LeaveRequest saved = leaveRepository.save(leave);

        // Notify Supervisor if exists, and notify Staff
        if (staff.getSupervisorEmployeeId() != null) {
            notificationService.createNotification(
                    staff.getSupervisorEmployeeId(),
                    "New Leave Request",
                    staff.getFullName() + " applied for " + totalDays + " day(s) leave (" + request.getStartDate() + " to " + request.getEndDate() + ").",
                    "LEAVE"
            );
        }

        notificationService.createNotification(
                employeeId,
                "Leave Application Submitted",
                "Your leave request for " + totalDays + " day(s) was submitted for review.",
                "LEAVE"
        );

        return mapToDto(saved, staff);
    }

    /**
     * Supervisor reviews staff leave request
     */
    @Transactional
    public LeaveResponseDto supervisorReview(String supervisorEmployeeId, LeaveReviewRequest request) {
        LeaveRequest leave = leaveRepository.findById(request.getLeaveRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + request.getLeaveRequestId()));

        User staff = userRepository.findByEmployeeId(leave.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + leave.getEmployeeId()));

        if (!supervisorEmployeeId.equals(staff.getSupervisorEmployeeId())) {
            throw new BadRequestException("Staff member is not assigned to your supervision");
        }

        boolean isApprove = "APPROVE".equalsIgnoreCase(request.getAction());
        leave.setSupervisorStatus(isApprove ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED);
        leave.setSupervisorRemarks(request.getRemarks());
        leave.setSupervisorReviewedBy(supervisorEmployeeId);
        leave.setSupervisorReviewedAt(LocalDateTime.now());

        if (isApprove) {
            leave.setFinalStatus(LeaveStatus.SUPERVISOR_APPROVED);
        } else {
            leave.setFinalStatus(LeaveStatus.REJECTED);
        }

        LeaveRequest updated = leaveRepository.save(leave);

        // Notify staff of supervisor action
        notificationService.createNotification(
                staff.getEmployeeId(),
                "Supervisor Reviewed Leave",
                "Your supervisor " + (isApprove ? "recommended/approved" : "rejected") + " your leave. " +
                        (request.getRemarks() != null ? "Remarks: " + request.getRemarks() : ""),
                "LEAVE"
        );

        return mapToDto(updated, staff);
    }

    /**
     * Principal final approval/rejection
     */
    @Transactional
    public LeaveResponseDto principalFinalDecision(String principalEmployeeId, LeaveReviewRequest request) {
        LeaveRequest leave = leaveRepository.findById(request.getLeaveRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + request.getLeaveRequestId()));

        User staff = userRepository.findByEmployeeId(leave.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + leave.getEmployeeId()));

        boolean isApprove = "APPROVE".equalsIgnoreCase(request.getAction());

        leave.setPrincipalStatus(isApprove ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED);
        leave.setPrincipalRemarks(request.getRemarks());
        leave.setPrincipalApprovedBy(principalEmployeeId);
        leave.setPrincipalApprovedAt(LocalDateTime.now());

        if (isApprove) {
            leave.setFinalStatus(LeaveStatus.APPROVED);

            // Deduct paid leave balance ONLY NOW!
            int paidDaysToDeduct = leave.getPaidDays();
            if (paidDaysToDeduct > 0) {
                int newBalance = Math.max(0, staff.getPaidLeaveBalance() - paidDaysToDeduct);
                staff.setPaidLeaveBalance(newBalance);
                userRepository.save(staff);
            }

            // Sync Attendance: For every date in this leave period, ensure attendance is ON_LEAVE
            LocalDate cur = leave.getStartDate();
            while (!cur.isAfter(leave.getEndDate())) {
                Optional<Attendance> existingAtt = attendanceRepository.findByEmployeeIdAndAttendanceDate(staff.getEmployeeId(), cur);
                if (existingAtt.isPresent()) {
                    Attendance att = existingAtt.get();
                    att.setFinalStatus(FinalAttendanceStatus.ON_LEAVE);
                    att.setApprovalStatus(ApprovalStatus.APPROVED);
                    att.setApprovedBy(principalEmployeeId);
                    att.setApprovedAt(LocalDateTime.now());
                    att.setPrincipalRemarks("Approved Leave: " + leave.getLeaveType());
                    attendanceRepository.save(att);
                } else {
                    Attendance att = new Attendance();
                    att.setEmployeeId(staff.getEmployeeId());
                    att.setAttendanceDate(cur);
                    att.setMarkedStatus(null);
                    att.setMarkedAt(LocalDateTime.now());
                    att.setApprovalStatus(ApprovalStatus.APPROVED);
                    att.setFinalStatus(FinalAttendanceStatus.ON_LEAVE);
                    att.setApprovedBy(principalEmployeeId);
                    att.setApprovedAt(LocalDateTime.now());
                    att.setPrincipalRemarks("Approved Leave: " + leave.getLeaveType());
                    attendanceRepository.save(att);
                }
                cur = cur.plusDays(1);
            }

            notificationService.createNotification(
                    staff.getEmployeeId(),
                    "Leave Approved by Principal",
                    "Your leave from " + leave.getStartDate() + " to " + leave.getEndDate() + " was APPROVED. (" +
                            leave.getPaidDays() + " Paid, " + leave.getUnpaidDays() + " Unpaid). Remaining Paid Leave: " +
                            staff.getPaidLeaveBalance(),
                    "LEAVE"
            );
        } else {
            leave.setFinalStatus(LeaveStatus.REJECTED);
            notificationService.createNotification(
                    staff.getEmployeeId(),
                    "Leave Rejected by Principal",
                    "Your leave application was rejected. " + (request.getRemarks() != null ? "Reason: " + request.getRemarks() : ""),
                    "LEAVE"
            );
        }

        LeaveRequest updated = leaveRepository.save(leave);
        return mapToDto(updated, staff);
    }

    /**
     * Cancel pending leave by staff
     */
    @Transactional
    public LeaveResponseDto cancelLeave(String employeeId, Long leaveId) {
        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + leaveId));

        if (!leave.getEmployeeId().equals(employeeId)) {
            throw new BadRequestException("You can only cancel your own leave requests");
        }
        if (leave.getFinalStatus() == LeaveStatus.APPROVED) {
            throw new BadRequestException("Cannot cancel an already approved leave. Contact Principal.");
        }

        leave.setFinalStatus(LeaveStatus.CANCELLED);
        LeaveRequest updated = leaveRepository.save(leave);

        notificationService.createNotification(
                employeeId,
                "Leave Cancelled",
                "Your leave request for " + leave.getStartDate() + " has been cancelled.",
                "LEAVE"
        );

        User staff = userRepository.findByEmployeeId(employeeId).orElse(null);
        return mapToDto(updated, staff);
    }

    public List<LeaveResponseDto> getStaffLeaves(String employeeId) {
        User staff = userRepository.findByEmployeeId(employeeId).orElse(null);
        return leaveRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId).stream()
                .map(l -> mapToDto(l, staff))
                .collect(Collectors.toList());
    }

    public List<LeaveResponseDto> getSupervisorTeamLeaves(String supervisorEmployeeId) {
        List<User> assigned = userRepository.findBySupervisorEmployeeId(supervisorEmployeeId);
        Map<String, User> userMap = assigned.stream().collect(Collectors.toMap(User::getEmployeeId, u -> u));

        List<String> empIds = new ArrayList<>(userMap.keySet());
        if (empIds.isEmpty()) return Collections.emptyList();

        return leaveRepository.findByEmployeeIdsOrderByCreatedAtDesc(empIds).stream()
                .map(l -> mapToDto(l, userMap.get(l.getEmployeeId())))
                .collect(Collectors.toList());
    }

    public List<LeaveResponseDto> getAllLeavesForPrincipal() {
        Map<String, User> userMap = userRepository.findAll().stream().collect(Collectors.toMap(User::getEmployeeId, u -> u));
        return leaveRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(l -> mapToDto(l, userMap.get(l.getEmployeeId())))
                .collect(Collectors.toList());
    }

    public LeaveResponseDto mapToDto(LeaveRequest leave, User staff) {
        LeaveResponseDto dto = new LeaveResponseDto();
        dto.setId(leave.getId());
        dto.setEmployeeId(leave.getEmployeeId());
        dto.setLeaveType(leave.getLeaveType());
        dto.setStartDate(leave.getStartDate());
        dto.setEndDate(leave.getEndDate());
        dto.setTotalDays(leave.getTotalDays());
        dto.setPaidDays(leave.getPaidDays());
        dto.setUnpaidDays(leave.getUnpaidDays());
        dto.setReason(leave.getReason());
        dto.setAttachmentUrl(leave.getAttachmentUrl());
        dto.setSupervisorStatus(leave.getSupervisorStatus());
        dto.setSupervisorRemarks(leave.getSupervisorRemarks());
        dto.setSupervisorReviewedBy(leave.getSupervisorReviewedBy());
        dto.setSupervisorReviewedAt(leave.getSupervisorReviewedAt());
        dto.setPrincipalStatus(leave.getPrincipalStatus());
        dto.setPrincipalRemarks(leave.getPrincipalRemarks());
        dto.setPrincipalApprovedBy(leave.getPrincipalApprovedBy());
        dto.setPrincipalApprovedAt(leave.getPrincipalApprovedAt());
        dto.setFinalStatus(leave.getFinalStatus());
        dto.setCreatedAt(leave.getCreatedAt());
        dto.setUpdatedAt(leave.getUpdatedAt());

        if (staff != null) {
            dto.setStaffName(staff.getFullName());
            dto.setDepartment(staff.getDepartment());
            dto.setDesignation(staff.getDesignation());
            dto.setSupervisorEmployeeId(staff.getSupervisorEmployeeId());
        }

        return dto;
    }
}
