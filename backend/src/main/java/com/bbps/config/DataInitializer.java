package com.bbps.config;

import com.bbps.model.*;
import com.bbps.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final AttendanceAuditRepository auditRepository;
    private final LeaveRequestRepository leaveRepository;
    private final SchoolHolidayRepository holidayRepository;
    private final NotificationRepository notificationRepository;
    private final LeaveYearConfigRepository leaveYearConfigRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           AttendanceRepository attendanceRepository,
                           AttendanceAuditRepository auditRepository,
                           LeaveRequestRepository leaveRepository,
                           SchoolHolidayRepository holidayRepository,
                           NotificationRepository notificationRepository,
                           LeaveYearConfigRepository leaveYearConfigRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.attendanceRepository = attendanceRepository;
        this.auditRepository = auditRepository;
        this.leaveRepository = leaveRepository;
        this.holidayRepository = holidayRepository;
        this.notificationRepository = notificationRepository;
        this.leaveYearConfigRepository = leaveYearConfigRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Leave Year Config
        LeaveYearConfig currentYear = new LeaveYearConfig("2026-2027",
                LocalDate.of(2026, 4, 1),
                LocalDate.of(2027, 3, 31),
                8, true);
        leaveYearConfigRepository.save(currentYear);

        // 2. School Holidays
        holidayRepository.save(new SchoolHoliday(LocalDate.of(2026, 1, 26), "Republic Day", "HOLIDAY", "National Holiday"));
        holidayRepository.save(new SchoolHoliday(LocalDate.of(2026, 8, 15), "Independence Day", "HOLIDAY", "National Holiday"));
        holidayRepository.save(new SchoolHoliday(LocalDate.of(2026, 10, 2), "Gandhi Jayanti", "HOLIDAY", "National Holiday"));
        holidayRepository.save(new SchoolHoliday(LocalDate.of(2026, 11, 8), "Diwali", "HOLIDAY", "Festival of Lights"));
        holidayRepository.save(new SchoolHoliday(LocalDate.of(2026, 12, 25), "Christmas", "HOLIDAY", "Christmas celebration"));

        // 3. Seed Users
        String defaultPw = passwordEncoder.encode("admin123");

        // Principal
        User principal = new User();
        principal.setEmployeeId("EMP001");
        principal.setFullName("Dr. Ananya Sharma");
        principal.setEmail("principal@bbps.edu");
        principal.setPassword(defaultPw);
        principal.setMobileNumber("+91 98765 43210");
        principal.setDepartment("Administration");
        principal.setDesignation("School Principal & Director");
        principal.setJoiningDate(LocalDate.of(2018, 6, 1));
        principal.setRole(Role.ROLE_PRINCIPAL);
        principal.setStatus(AccountStatus.ACTIVE);
        principal.setPaidLeaveBalance(8);
        userRepository.save(principal);

        // Supervisor 1 (Science)
        User sup1 = new User();
        sup1.setEmployeeId("EMP002");
        sup1.setFullName("Prof. Rajesh Verma");
        sup1.setEmail("supervisor1@bbps.edu");
        sup1.setPassword(defaultPw);
        sup1.setMobileNumber("+91 98765 43211");
        sup1.setDepartment("Science");
        sup1.setDesignation("Head of Science Department");
        sup1.setJoiningDate(LocalDate.of(2019, 7, 15));
        sup1.setRole(Role.ROLE_SUPERVISOR);
        sup1.setStatus(AccountStatus.ACTIVE);
        sup1.setPaidLeaveBalance(8);
        userRepository.save(sup1);

        // Supervisor 2 (Humanities)
        User sup2 = new User();
        sup2.setEmployeeId("EMP003");
        sup2.setFullName("Mrs. Sunita Rao");
        sup2.setEmail("supervisor2@bbps.edu");
        sup2.setPassword(defaultPw);
        sup2.setMobileNumber("+91 98765 43212");
        sup2.setDepartment("Humanities");
        sup2.setDesignation("Academic Coordinator");
        sup2.setJoiningDate(LocalDate.of(2020, 4, 10));
        sup2.setRole(Role.ROLE_SUPERVISOR);
        sup2.setStatus(AccountStatus.ACTIVE);
        sup2.setPaidLeaveBalance(8);
        userRepository.save(sup2);

        // Staff 1 (Science - Physics)
        User staff1 = new User();
        staff1.setEmployeeId("EMP004");
        staff1.setFullName("Pooja Malhotra");
        staff1.setEmail("staff1@bbps.edu");
        staff1.setPassword(defaultPw);
        staff1.setMobileNumber("+91 98765 43213");
        staff1.setDepartment("Science");
        staff1.setDesignation("Senior Physics Teacher");
        staff1.setJoiningDate(LocalDate.of(2021, 8, 1));
        staff1.setSupervisorEmployeeId("EMP002");
        staff1.setRole(Role.ROLE_STAFF);
        staff1.setStatus(AccountStatus.ACTIVE);
        staff1.setPaidLeaveBalance(6); // 2 used
        userRepository.save(staff1);

        // Staff 2 (Science - Chemistry)
        User staff2 = new User();
        staff2.setEmployeeId("EMP005");
        staff2.setFullName("Amitabh Sen");
        staff2.setEmail("staff2@bbps.edu");
        staff2.setPassword(defaultPw);
        staff2.setMobileNumber("+91 98765 43214");
        staff2.setDepartment("Science");
        staff2.setDesignation("Chemistry Teacher");
        staff2.setJoiningDate(LocalDate.of(2022, 1, 10));
        staff2.setSupervisorEmployeeId("EMP002");
        staff2.setRole(Role.ROLE_STAFF);
        staff2.setStatus(AccountStatus.ACTIVE);
        staff2.setPaidLeaveBalance(8);
        userRepository.save(staff2);

        // Staff 3 (Humanities - English)
        User staff3 = new User();
        staff3.setEmployeeId("EMP006");
        staff3.setFullName("Neha Kapoor");
        staff3.setEmail("staff3@bbps.edu");
        staff3.setPassword(defaultPw);
        staff3.setMobileNumber("+91 98765 43215");
        staff3.setDepartment("Humanities");
        staff3.setDesignation("English Literature Teacher");
        staff3.setJoiningDate(LocalDate.of(2021, 11, 1));
        staff3.setSupervisorEmployeeId("EMP003");
        staff3.setRole(Role.ROLE_STAFF);
        staff3.setStatus(AccountStatus.ACTIVE);
        staff3.setPaidLeaveBalance(5); // 3 used
        userRepository.save(staff3);

        // Staff 4 (Mathematics)
        User staff4 = new User();
        staff4.setEmployeeId("EMP007");
        staff4.setFullName("Vikram Mehta");
        staff4.setEmail("staff4@bbps.edu");
        staff4.setPassword(defaultPw);
        staff4.setMobileNumber("+91 98765 43216");
        staff4.setDepartment("Mathematics");
        staff4.setDesignation("PGT Mathematics");
        staff4.setJoiningDate(LocalDate.of(2023, 3, 1));
        staff4.setSupervisorEmployeeId("EMP002");
        staff4.setRole(Role.ROLE_STAFF);
        staff4.setStatus(AccountStatus.ACTIVE);
        staff4.setPaidLeaveBalance(7); // 1 used
        userRepository.save(staff4);

        // 4. Seed Past Attendance records (Last 3 days)
        LocalDate today = LocalDate.now();
        LocalDate d1 = today.minusDays(1);
        LocalDate d2 = today.minusDays(2);

        // Previous Day d1: Approved attendance
        createApprovedAttendance("EMP004", d1, MarkedStatus.PRESENT, FinalAttendanceStatus.PRESENT, "EMP001", "On time");
        createApprovedAttendance("EMP005", d1, MarkedStatus.PRESENT, FinalAttendanceStatus.PRESENT, "EMP001", "On time");
        createApprovedAttendance("EMP006", d1, MarkedStatus.ABSENT, FinalAttendanceStatus.ABSENT, "EMP001", "Informed absent");
        createApprovedAttendance("EMP007", d1, MarkedStatus.PRESENT, FinalAttendanceStatus.PRESENT, "EMP001", "On time");

        // Day d2
        createApprovedAttendance("EMP004", d2, MarkedStatus.PRESENT, FinalAttendanceStatus.PRESENT, "EMP001", "Verified");
        createApprovedAttendance("EMP005", d2, MarkedStatus.PRESENT, FinalAttendanceStatus.PRESENT, "EMP001", "Verified");
        createApprovedAttendance("EMP006", d2, MarkedStatus.PRESENT, FinalAttendanceStatus.PRESENT, "EMP001", "Verified");
        createApprovedAttendance("EMP007", d2, MarkedStatus.PRESENT, FinalAttendanceStatus.PRESENT, "EMP001", "Verified");

        // Today's attendance - Ready for live testing!
        // EMP004 marked PRESENT, PENDING Principal approval
        Attendance todayAtt1 = new Attendance();
        todayAtt1.setEmployeeId("EMP004");
        todayAtt1.setAttendanceDate(today);
        todayAtt1.setMarkedStatus(MarkedStatus.PRESENT);
        todayAtt1.setMarkedAt(LocalDateTime.now().minusHours(1).withMinute(2));
        todayAtt1.setApprovalStatus(ApprovalStatus.PENDING);
        todayAtt1.setFinalStatus(FinalAttendanceStatus.PENDING);
        attendanceRepository.save(todayAtt1);

        // EMP005 marked ABSENT, PENDING Principal approval
        Attendance todayAtt2 = new Attendance();
        todayAtt2.setEmployeeId("EMP005");
        todayAtt2.setAttendanceDate(today);
        todayAtt2.setMarkedStatus(MarkedStatus.ABSENT);
        todayAtt2.setMarkedAt(LocalDateTime.now().minusHours(1).withMinute(8));
        todayAtt2.setApprovalStatus(ApprovalStatus.PENDING);
        todayAtt2.setFinalStatus(FinalAttendanceStatus.PENDING);
        attendanceRepository.save(todayAtt2);

        // EMP006 is ON LEAVE today
        Attendance todayAtt3 = new Attendance();
        todayAtt3.setEmployeeId("EMP006");
        todayAtt3.setAttendanceDate(today);
        todayAtt3.setMarkedStatus(null);
        todayAtt3.setMarkedAt(LocalDateTime.now().minusHours(2));
        todayAtt3.setApprovalStatus(ApprovalStatus.APPROVED);
        todayAtt3.setFinalStatus(FinalAttendanceStatus.ON_LEAVE);
        todayAtt3.setApprovedBy("EMP001");
        todayAtt3.setApprovedAt(LocalDateTime.now().minusHours(2));
        todayAtt3.setPrincipalRemarks("Approved Medical Leave");
        attendanceRepository.save(todayAtt3);

        // EMP007 has not marked yet today!

        // 5. Seed Leave Requests
        // Leave 1 for EMP006: Medical leave covering today (Approved)
        LeaveRequest leave1 = new LeaveRequest();
        leave1.setEmployeeId("EMP006");
        leave1.setLeaveType(LeaveType.SICK);
        leave1.setStartDate(today);
        leave1.setEndDate(today.plusDays(1));
        leave1.setTotalDays(2);
        leave1.setPaidDays(2);
        leave1.setUnpaidDays(0);
        leave1.setReason("Recovering from viral fever and throat infection");
        leave1.setSupervisorStatus(ApprovalStatus.APPROVED);
        leave1.setSupervisorRemarks("Medical certificate verified");
        leave1.setSupervisorReviewedBy("EMP003");
        leave1.setSupervisorReviewedAt(LocalDateTime.now().minusDays(1));
        leave1.setPrincipalStatus(ApprovalStatus.APPROVED);
        leave1.setPrincipalRemarks("Get well soon. Approved.");
        leave1.setPrincipalApprovedBy("EMP001");
        leave1.setPrincipalApprovedAt(LocalDateTime.now().minusDays(1));
        leave1.setFinalStatus(LeaveStatus.APPROVED);
        leaveRepository.save(leave1);

        // Leave 2 for EMP004: Upcoming Casual Leave (Pending Supervisor review)
        LeaveRequest leave2 = new LeaveRequest();
        leave2.setEmployeeId("EMP004");
        leave2.setLeaveType(LeaveType.CASUAL);
        leave2.setStartDate(today.plusDays(3));
        leave2.setEndDate(today.plusDays(4));
        leave2.setTotalDays(2);
        leave2.setPaidDays(2);
        leave2.setUnpaidDays(0);
        leave2.setReason("Family function out of station");
        leave2.setSupervisorStatus(ApprovalStatus.PENDING);
        leave2.setPrincipalStatus(ApprovalStatus.PENDING);
        leave2.setFinalStatus(LeaveStatus.PENDING);
        leaveRepository.save(leave2);

        // 6. Seed Sample Audit Trail Record
        AttendanceAudit audit1 = new AttendanceAudit(
                1L, "EMP006", d1, "PRESENT", "ABSENT",
                "EMP001", LocalDateTime.now().minusDays(1).withHour(16).withMinute(30),
                "Staff left school early due to medical emergency"
        );
        auditRepository.save(audit1);

        // 7. Seed Notifications
        notificationRepository.save(new Notification("EMP004", "Welcome to BBPS Staff Portal", "Your account is activated with 8 paid leave days for 2026-2027.", "SYSTEM"));
        notificationRepository.save(new Notification("EMP004", "Attendance Submitted", "Your attendance for today has been recorded. Waiting for Principal approval.", "ATTENDANCE"));
        notificationRepository.save(new Notification("EMP002", "Pending Leave Application", "Pooja Malhotra applied for 2 days Casual Leave.", "LEAVE"));
        notificationRepository.save(new Notification("EMP001", "Daily Attendance Ready", "Staff attendance for today is waiting for your verification.", "ATTENDANCE"));
    }

    private void createApprovedAttendance(String employeeId, LocalDate date, MarkedStatus marked,
                                          FinalAttendanceStatus finalStatus, String approvedBy, String remarks) {
        Attendance att = new Attendance();
        att.setEmployeeId(employeeId);
        att.setAttendanceDate(date);
        att.setMarkedStatus(marked);
        att.setMarkedAt(date.atTime(9, 5));
        att.setApprovalStatus(ApprovalStatus.APPROVED);
        att.setFinalStatus(finalStatus);
        att.setApprovedBy(approvedBy);
        att.setApprovedAt(date.atTime(9, 30));
        att.setPrincipalRemarks(remarks);
        attendanceRepository.save(att);
    }
}
