package com.bbps.controller;

import com.bbps.dto.DashboardStatsDto;
import com.bbps.model.*;
import com.bbps.repository.AttendanceRepository;
import com.bbps.repository.LeaveRequestRepository;
import com.bbps.repository.UserRepository;
import com.bbps.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRepository;
    private final AttendanceService attendanceService;

    public DashboardController(UserRepository userRepository,
                               AttendanceRepository attendanceRepository,
                               LeaveRequestRepository leaveRepository,
                               AttendanceService attendanceService) {
        this.userRepository = userRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.attendanceService = attendanceService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats(Authentication auth) {
        String employeeId = auth.getName();
        User currentUser = userRepository.findByEmployeeId(employeeId).orElse(null);

        DashboardStatsDto dto = new DashboardStatsDto();
        LocalDate today = LocalDate.now();

        if (currentUser == null) {
            return ResponseEntity.ok(dto);
        }

        // Staff-specific metrics
        dto.setMyPaidLeaveTotal(8);
        dto.setMyPaidLeaveRemaining(currentUser.getPaidLeaveBalance());
        dto.setMyPaidLeaveUsed(8 - currentUser.getPaidLeaveBalance());
        dto.setTodayAttendance(attendanceService.getTodayStatus(employeeId));

        dto.setMyPendingLeaves(leaveRepository.countByEmployeeIdAndFinalStatus(employeeId, LeaveStatus.PENDING)
                + leaveRepository.countByEmployeeIdAndFinalStatus(employeeId, LeaveStatus.SUPERVISOR_APPROVED));
        dto.setMyApprovedLeaves(leaveRepository.countByEmployeeIdAndFinalStatus(employeeId, LeaveStatus.APPROVED));
        dto.setMyRejectedLeaves(leaveRepository.countByEmployeeIdAndFinalStatus(employeeId, LeaveStatus.REJECTED));

        long myPresent = attendanceRepository.countByEmployeeIdAndFinalStatus(employeeId, FinalAttendanceStatus.PRESENT);
        long myAbsent = attendanceRepository.countByEmployeeIdAndFinalStatus(employeeId, FinalAttendanceStatus.ABSENT);
        long myLeave = attendanceRepository.countByEmployeeIdAndFinalStatus(employeeId, FinalAttendanceStatus.ON_LEAVE);
        dto.setMyPresentDays(myPresent);
        dto.setMyAbsentDays(myAbsent);
        dto.setMyLeaveDays(myLeave);

        long totalRecorded = myPresent + myAbsent + myLeave;
        dto.setMyAttendancePercentage(totalRecorded > 0 ? Math.round(((double) myPresent / totalRecorded) * 1000.0) / 10.0 : 100.0);

        if (currentUser.getRole() == Role.ROLE_PRINCIPAL) {
            // Principal: School-wide statistics
            List<User> allStaff = userRepository.findAll().stream()
                    .filter(u -> u.getRole() != Role.ROLE_PRINCIPAL)
                    .collect(Collectors.toList());

            dto.setTotalStaff(allStaff.size());

            List<Attendance> todayAttendances = attendanceRepository.findByAttendanceDate(today);
            long presentCount = todayAttendances.stream().filter(a -> a.getFinalStatus() == FinalAttendanceStatus.PRESENT).count();
            long absentCount = todayAttendances.stream().filter(a -> a.getFinalStatus() == FinalAttendanceStatus.ABSENT).count();
            long onLeaveCount = leaveRepository.findAllApprovedLeavesOnDate(today).size();
            long pendingApproval = todayAttendances.stream().filter(a -> a.getApprovalStatus() == ApprovalStatus.PENDING).count();

            dto.setPresentToday(presentCount);
            dto.setAbsentToday(absentCount);
            dto.setOnLeaveToday(onLeaveCount);
            dto.setPendingAttendanceApprovals(pendingApproval);
            dto.setNotMarkedToday(Math.max(0, allStaff.size() - todayAttendances.size()));

            dto.setPendingLeaveRequests(leaveRepository.countByFinalStatus(LeaveStatus.PENDING) + leaveRepository.countByFinalStatus(LeaveStatus.SUPERVISOR_APPROVED));
            dto.setApprovedLeaves(leaveRepository.countByFinalStatus(LeaveStatus.APPROVED));
            dto.setRejectedLeaves(leaveRepository.countByFinalStatus(LeaveStatus.REJECTED));

            Map<String, Long> deptMap = allStaff.stream()
                    .filter(u -> u.getDepartment() != null)
                    .collect(Collectors.groupingBy(User::getDepartment, Collectors.counting()));
            dto.setDepartmentBreakdown(deptMap);

        } else if (currentUser.getRole() == Role.ROLE_SUPERVISOR) {
            // Supervisor: Assigned staff statistics
            List<User> assigned = userRepository.findBySupervisorEmployeeId(employeeId);
            dto.setTotalStaff(assigned.size());

            List<String> assignedIds = assigned.stream().map(User::getEmployeeId).collect(Collectors.toList());
            if (!assignedIds.isEmpty()) {
                List<Attendance> teamAtt = attendanceRepository.findByEmployeeIdsAndDate(assignedIds, today);
                long present = teamAtt.stream().filter(a -> a.getFinalStatus() == FinalAttendanceStatus.PRESENT).count();
                long absent = teamAtt.stream().filter(a -> a.getFinalStatus() == FinalAttendanceStatus.ABSENT).count();
                long pending = teamAtt.stream().filter(a -> a.getApprovalStatus() == ApprovalStatus.PENDING).count();
                long onLeave = assignedIds.stream().filter(id -> !leaveRepository.findApprovedLeavesForEmployeeOnDate(id, today).isEmpty()).count();

                dto.setPresentToday(present);
                dto.setAbsentToday(absent);
                dto.setOnLeaveToday(onLeave);
                dto.setPendingAttendanceApprovals(pending);
                dto.setNotMarkedToday(Math.max(0, assigned.size() - teamAtt.size()));

                List<LeaveRequest> teamLeaves = leaveRepository.findByEmployeeIdsOrderByCreatedAtDesc(assignedIds);
                dto.setPendingLeaveRequests(teamLeaves.stream().filter(l -> l.getFinalStatus() == LeaveStatus.PENDING).count());
                dto.setApprovedLeaves(teamLeaves.stream().filter(l -> l.getFinalStatus() == LeaveStatus.APPROVED).count());
                dto.setRejectedLeaves(teamLeaves.stream().filter(l -> l.getFinalStatus() == LeaveStatus.REJECTED).count());
            }
        }

        return ResponseEntity.ok(dto);
    }
}
