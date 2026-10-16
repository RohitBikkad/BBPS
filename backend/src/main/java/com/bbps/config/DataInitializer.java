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
    private final StudentRepository studentRepository;
    private final StudentDailyCareLogRepository careLogRepository;
    private final StudentMomentRepository momentRepository;
    private final AuthorizedPickupRepository pickupRepository;
    private final DevelopmentalMilestoneRepository milestoneRepository;
    private final StudentLeaveRequestRepository studentLeaveRepository;
    private final StudentFeeRecordRepository feeRepository;
    private final PackTomorrowReminderRepository reminderRepository;

    public DataInitializer(UserRepository userRepository,
                           AttendanceRepository attendanceRepository,
                           AttendanceAuditRepository auditRepository,
                           LeaveRequestRepository leaveRepository,
                           SchoolHolidayRepository holidayRepository,
                           NotificationRepository notificationRepository,
                           LeaveYearConfigRepository leaveYearConfigRepository,
                           PasswordEncoder passwordEncoder,
                           StudentRepository studentRepository,
                           StudentDailyCareLogRepository careLogRepository,
                           StudentMomentRepository momentRepository,
                           AuthorizedPickupRepository pickupRepository,
                           DevelopmentalMilestoneRepository milestoneRepository,
                           StudentLeaveRequestRepository studentLeaveRepository,
                           StudentFeeRecordRepository feeRepository,
                           PackTomorrowReminderRepository reminderRepository) {
        this.userRepository = userRepository;
        this.attendanceRepository = attendanceRepository;
        this.auditRepository = auditRepository;
        this.leaveRepository = leaveRepository;
        this.holidayRepository = holidayRepository;
        this.notificationRepository = notificationRepository;
        this.leaveYearConfigRepository = leaveYearConfigRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
        this.careLogRepository = careLogRepository;
        this.momentRepository = momentRepository;
        this.pickupRepository = pickupRepository;
        this.milestoneRepository = milestoneRepository;
        this.studentLeaveRepository = studentLeaveRepository;
        this.feeRepository = feeRepository;
        this.reminderRepository = reminderRepository;
    }

    @Override
    public void run(String... args) {
        String defaultPw = passwordEncoder.encode("admin123");

        if (userRepository.count() == 0) {
            seedStaffUsers(defaultPw);
        }

        if (studentRepository.count() == 0) {
            seedStudentAndParentData(defaultPw);
        }
    }

    private void seedStaffUsers(String defaultPw) {

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

    private void seedStudentAndParentData(String defaultPw) {
        LocalDate today = LocalDate.now();

        // 1. Create Parent Users
        User parent1 = new User();
        parent1.setEmployeeId("PAR001");
        parent1.setFullName("Vikram Sharma");
        parent1.setEmail("parent1@bbps.edu");
        parent1.setPassword(defaultPw);
        parent1.setMobileNumber("+91 98230 11223");
        parent1.setDepartment("Parents");
        parent1.setDesignation("Parent / Guardian");
        parent1.setJoiningDate(LocalDate.of(2025, 4, 1));
        parent1.setRole(Role.ROLE_PARENT);
        parent1.setStatus(AccountStatus.ACTIVE);
        parent1.setPaidLeaveBalance(0);
        userRepository.save(parent1);

        User parent2 = new User();
        parent2.setEmployeeId("PAR002");
        parent2.setFullName("Priya Verma");
        parent2.setEmail("parent2@bbps.edu");
        parent2.setPassword(defaultPw);
        parent2.setMobileNumber("+91 98230 44556");
        parent2.setDepartment("Parents");
        parent2.setDesignation("Parent / Guardian");
        parent2.setJoiningDate(LocalDate.of(2024, 4, 1));
        parent2.setRole(Role.ROLE_PARENT);
        parent2.setStatus(AccountStatus.ACTIVE);
        parent2.setPaidLeaveBalance(0);
        userRepository.save(parent2);

        // 2. Pre-Primary Students
        Student s1 = new Student();
        s1.setAdmissionNumber("BBPS-2026-N101");
        s1.setFirstName("Aarav");
        s1.setLastName("Sharma");
        s1.setGrade("Nursery");
        s1.setSection("Butterflies");
        s1.setRollNumber("04");
        s1.setDob(LocalDate.of(2022, 4, 12));
        s1.setGender("Boy");
        s1.setBloodGroup("B+");
        s1.setAvatarUrl("https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=300&q=80");
        s1.setAllergies("Peanut sensitive (mild)");
        s1.setPediatricianContact("Dr. Mehta (+91 98220 99887)");
        s1.setEmergencyPhone("+91 98230 11223");
        s1.setParentUserId(parent1.getId());
        s1.setParentName("Vikram Sharma");
        s1.setParentEmail("parent1@bbps.edu");
        s1.setParentPhone("+91 98230 11223");
        s1.setMotherTeacherName("Neha Kapoor");
        s1.setSchoolBusVanNumber("Route #4 (Kalyani Nagar)");
        studentRepository.save(s1);

        Student s1Sibling = new Student();
        s1Sibling.setAdmissionNumber("BBPS-2026-P015");
        s1Sibling.setFirstName("Riya");
        s1Sibling.setLastName("Sharma");
        s1Sibling.setGrade("Playgroup");
        s1Sibling.setSection("Little Explorers");
        s1Sibling.setRollNumber("08");
        s1Sibling.setDob(LocalDate.of(2023, 8, 19));
        s1Sibling.setGender("Girl");
        s1Sibling.setBloodGroup("B+");
        s1Sibling.setAvatarUrl("https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=300&q=80");
        s1Sibling.setAllergies("None");
        s1Sibling.setPediatricianContact("Dr. Mehta (+91 98220 99887)");
        s1Sibling.setEmergencyPhone("+91 98230 11223");
        s1Sibling.setParentUserId(parent1.getId());
        s1Sibling.setParentName("Vikram Sharma");
        s1Sibling.setParentEmail("parent1@bbps.edu");
        s1Sibling.setParentPhone("+91 98230 11223");
        s1Sibling.setMotherTeacherName("Sunita Rao");
        s1Sibling.setSchoolBusVanNumber("Self Drop/Pickup");
        studentRepository.save(s1Sibling);

        Student s2 = new Student();
        s2.setAdmissionNumber("BBPS-2026-K202");
        s2.setFirstName("Ananya");
        s2.setLastName("Verma");
        s2.setGrade("KG");
        s2.setSection("Dolphins");
        s2.setRollNumber("12");
        s2.setDob(LocalDate.of(2021, 9, 5));
        s2.setGender("Girl");
        s2.setBloodGroup("O+");
        s2.setAvatarUrl("https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80");
        s2.setAllergies("None");
        s2.setPediatricianContact("Dr. Kulkarni (+91 98221 22334)");
        s2.setEmergencyPhone("+91 98230 44556");
        s2.setParentUserId(parent2.getId());
        s2.setParentName("Priya Verma");
        s2.setParentEmail("parent2@bbps.edu");
        s2.setParentPhone("+91 98230 44556");
        s2.setMotherTeacherName("Pooja Malhotra");
        s2.setSchoolBusVanNumber("Route #2 (Viman Nagar)");
        studentRepository.save(s2);

        // 3. Today's Care Log for Aarav
        StudentDailyCareLog care1 = new StudentDailyCareLog();
        care1.setStudentId(s1.getId());
        care1.setLogDate(today);
        care1.setCheckInTime("08:40 AM");
        care1.setAttendanceStatus("PRESENT");
        care1.setMealStatus("FINISHED_ALL");
        care1.setMealNotes("Finished whole moong dal khichdi & 3 slices of sweet apple. Drank full water bottle!");
        care1.setNapMinutes(45);
        care1.setNapNotes("Slept peacefully during 11:30 AM music nap time.");
        care1.setMood("HAPPY");
        care1.setTemperature("98.4 °F");
        care1.setMedicationGiven(false);
        care1.setActivitiesSummary("Sensory colored water beads, finger painting with yellow and green, circle time rhyme singing.");
        care1.setTeacherNotes("Aarav was exceptionally joyful today, helped clean up the play area, and shared crayons with friends!");
        care1.setRecordedByStaffId("EMP006");
        careLogRepository.save(care1);

        // Past 2 days logs for Aarav
        StudentDailyCareLog carePast1 = new StudentDailyCareLog();
        carePast1.setStudentId(s1.getId());
        carePast1.setLogDate(today.minusDays(1));
        carePast1.setCheckInTime("08:42 AM");
        carePast1.setCheckOutTime("12:30 PM");
        carePast1.setAttendanceStatus("PRESENT");
        carePast1.setMealStatus("FINISHED_ALL");
        carePast1.setMealNotes("Finished idli and sambar.");
        carePast1.setNapMinutes(40);
        carePast1.setMood("PLAYFUL");
        carePast1.setTeacherNotes("Enjoyed puzzle games and building blocks.");
        carePast1.setRecordedByStaffId("EMP006");
        careLogRepository.save(carePast1);

        StudentDailyCareLog carePast2 = new StudentDailyCareLog();
        carePast2.setStudentId(s1.getId());
        carePast2.setLogDate(today.minusDays(2));
        carePast2.setCheckInTime("08:45 AM");
        carePast2.setCheckOutTime("12:30 PM");
        carePast2.setAttendanceStatus("PRESENT");
        carePast2.setMealStatus("PARTIALLY_EATEN");
        carePast2.setMealNotes("Ate half vegetable paratha, loved the mango cubes.");
        carePast2.setNapMinutes(35);
        carePast2.setMood("CALM");
        carePast2.setTeacherNotes("Participated eagerly in alphabet recognition.");
        carePast2.setRecordedByStaffId("EMP006");
        careLogRepository.save(carePast2);

        // 4. Activity Moments & Gallery
        StudentMoment m1 = new StudentMoment();
        m1.setGrade("Nursery");
        m1.setSection("Butterflies");
        m1.setMomentDate(today);
        m1.setTitle("Sensory Color Splash & Water Bead Exploration");
        m1.setDescription("Today our little butterflies learned fine motor control with squishy sensory water trays and spoon-transfer games!");
        m1.setCategory("ACTIVITY");
        m1.setMediaUrl("https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80");
        m1.setTags("#SensoryPlay, #FineMotor, #Butterflies");
        m1.setWeeklyTheme("Theme of the Week: Colors, Shapes & Textures");
        m1.setCreatedByStaffId("EMP006");
        momentRepository.save(m1);

        StudentMoment m2 = new StudentMoment();
        m2.setGrade("Nursery");
        m2.setSection("Butterflies");
        m2.setMomentDate(today);
        m2.setTitle("Story Circle: The Very Hungry Caterpillar");
        m2.setDescription("We used felt puppets to count apples, strawberries, and leaves as the hungry caterpillar transformed into a gorgeous butterfly!");
        m2.setCategory("RHYME_MUSIC");
        m2.setMediaUrl("https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=600&q=80");
        m2.setTags("#StoryCircle, #PuppetShow, #LanguageSkills");
        m2.setWeeklyTheme("Theme of the Week: Colors, Shapes & Textures");
        m2.setRhymeLyrics("Crawling, crawling caterpillar, hungry as can be!\nMunching on a crunchy leaf, happy and so free!\nSpinning up a cozy cocoon, taking a little nap,\nWaking up a butterfly with a flap, flap, flap! 🦋");
        m2.setCreatedByStaffId("EMP006");
        momentRepository.save(m2);

        StudentMoment m3 = new StudentMoment();
        m3.setGrade("Nursery");
        m3.setSection("Butterflies");
        m3.setMomentDate(today.minusDays(1));
        m3.setTitle("Art Fridge: Thumbprint Autumn Tree");
        m3.setDescription("Each child dipped their little thumbs in turmeric yellow and beetroot red to create autumn leaves on their tree outline!");
        m3.setCategory("ART_CRAFT");
        m3.setMediaUrl("https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80");
        m3.setTags("#ArtFridge, #VegetableDye, #Creativity");
        m3.setWeeklyTheme("Nature & Leaves");
        m3.setCreatedByStaffId("EMP006");
        momentRepository.save(m3);

        // 5. Authorized Pickups for Aarav
        AuthorizedPickup p1 = new AuthorizedPickup();
        p1.setStudentId(s1.getId());
        p1.setGuardianName("Vikram Sharma");
        p1.setRelation("Father");
        p1.setPhone("+91 98230 11223");
        p1.setIsPrimary(true);
        p1.setIsTemporary(false);
        p1.setQrSecurityCode("PASS-BBPS-AARAV-FATHER-01");
        p1.setPhotoUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80");
        pickupRepository.save(p1);

        AuthorizedPickup p2 = new AuthorizedPickup();
        p2.setStudentId(s1.getId());
        p2.setGuardianName("Meera Sharma");
        p2.setRelation("Mother");
        p2.setPhone("+91 98230 11224");
        p2.setIsPrimary(false);
        p2.setIsTemporary(false);
        p2.setQrSecurityCode("PASS-BBPS-AARAV-MOTHER-02");
        p2.setPhotoUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80");
        pickupRepository.save(p2);

        AuthorizedPickup p3 = new AuthorizedPickup();
        p3.setStudentId(s1.getId());
        p3.setGuardianName("Ramesh Sharma");
        p3.setRelation("Grandfather");
        p3.setPhone("+91 98230 11225");
        p3.setIsPrimary(false);
        p3.setIsTemporary(false);
        p3.setQrSecurityCode("PASS-BBPS-AARAV-GRANDPA-03");
        p3.setPhotoUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80");
        pickupRepository.save(p3);

        AuthorizedPickup p4 = new AuthorizedPickup();
        p4.setStudentId(s1.getId());
        p4.setGuardianName("Ramesh Shinde (School Van Attendant)");
        p4.setRelation("Van Attendant");
        p4.setPhone("+91 98900 44556");
        p4.setIsPrimary(false);
        p4.setIsTemporary(false);
        p4.setQrSecurityCode("PASS-BBPS-VAN-ROUTE4");
        p4.setPhotoUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80");
        pickupRepository.save(p4);

        // 6. Developmental Milestones for Aarav
        DevelopmentalMilestone ms1 = new DevelopmentalMilestone();
        ms1.setStudentId(s1.getId());
        ms1.setTerm("Term 1 (2026-2027)");
        ms1.setDomain("FINE_MOTOR");
        ms1.setSkillTitle("Pincer Grasp & Crayon Grip");
        ms1.setRating("ACHIEVED");
        ms1.setBadgeTitle("Pincer Grip Pro");
        ms1.setBadgeIcon("sparkles");
        ms1.setTeacherNotes("Holds crayons with steady 3-finger tripod grip. Fills color within boundaries cleanly.");
        ms1.setEvaluatedDate(today.minusDays(5));
        milestoneRepository.save(ms1);

        DevelopmentalMilestone ms2 = new DevelopmentalMilestone();
        ms2.setStudentId(s1.getId());
        ms2.setTerm("Term 1 (2026-2027)");
        ms2.setDomain("LANGUAGE");
        ms2.setSkillTitle("Recites 4+ Rhymes with Gestures");
        ms2.setRating("ACHIEVED");
        ms2.setBadgeTitle("Rhyme Master");
        ms2.setBadgeIcon("music");
        ms2.setTeacherNotes("High verbal clarity, loves to sing in front of peers and remembers all actions!");
        ms2.setEvaluatedDate(today.minusDays(5));
        milestoneRepository.save(ms2);

        DevelopmentalMilestone ms3 = new DevelopmentalMilestone();
        ms3.setStudentId(s1.getId());
        ms3.setTerm("Term 1 (2026-2027)");
        ms3.setDomain("SOCIAL_EMOTIONAL");
        ms3.setSkillTitle("Sharing Play Tools & Turn Taking");
        ms3.setRating("ACHIEVED");
        ms3.setBadgeTitle("Star Sharer");
        ms3.setBadgeIcon("heart");
        ms3.setTeacherNotes("Always willing to pass the playdough tools to friends without fuss.");
        ms3.setEvaluatedDate(today.minusDays(6));
        milestoneRepository.save(ms3);

        DevelopmentalMilestone ms4 = new DevelopmentalMilestone();
        ms4.setStudentId(s1.getId());
        ms4.setTerm("Term 1 (2026-2027)");
        ms4.setDomain("GROSS_MOTOR");
        ms4.setSkillTitle("Single Foot Hop & Balance Walk");
        ms4.setRating("DEVELOPING");
        ms4.setBadgeTitle("Agile Explorer");
        ms4.setBadgeIcon("zap");
        ms4.setTeacherNotes("Steadily practicing single-leg hops on the gym mat. Great coordination!");
        ms4.setEvaluatedDate(today.minusDays(6));
        milestoneRepository.save(ms4);

        DevelopmentalMilestone ms5 = new DevelopmentalMilestone();
        ms5.setStudentId(s1.getId());
        ms5.setTerm("Term 1 (2026-2027)");
        ms5.setDomain("COGNITIVE");
        ms5.setSkillTitle("Primary Color & 4-Shape Sorting");
        ms5.setRating("ACHIEVED");
        ms5.setBadgeTitle("Shape Detective");
        ms5.setBadgeIcon("puzzle");
        ms5.setTeacherNotes("Quickly identifies circles, squares, triangles and matches them to cutouts.");
        ms5.setEvaluatedDate(today.minusDays(4));
        milestoneRepository.save(ms5);

        // 7. Tomorrow Reminder
        PackTomorrowReminder r1 = new PackTomorrowReminder();
        r1.setGrade("Nursery");
        r1.setSection("Butterflies");
        r1.setTargetDate(today.plusDays(1));
        r1.setTitle("Sunshine Yellow Day Celebration!");
        r1.setMessage("Tomorrow we are celebrating Yellow Day! Children will explore sun shapes, sunflowers and yellow fruits.");
        r1.setDressCode("Bright Yellow Casual / Yellow T-Shirt");
        r1.setItemsToPack("1 Yellow Apron, 1 Yellow Fruit (Banana / Mango / Papaya) for lunchtime sharing, extra pair of socks.");
        r1.setBadgeTag("COLOR_DAY");
        r1.setCreatedByStaffId("EMP006");
        reminderRepository.save(r1);

        // 8. Fee Records for Aarav
        StudentFeeRecord f1 = new StudentFeeRecord();
        f1.setStudentId(s1.getId());
        f1.setTermName("Term 1 (April - July 2026)");
        f1.setAmount(28500.0);
        f1.setDueDate(LocalDate.of(2026, 4, 10));
        f1.setPaidDate(LocalDate.of(2026, 4, 5));
        f1.setStatus("PAID");
        f1.setReceiptNumber("BBPS-2026-REC0104");
        f1.setPaymentMethod("UPI (HDFC Bank)");
        f1.setBreakdownJson("Tuition Fee: ₹22,000 | Activity & Sensory Kits: ₹4,500 | Nutritious Snack & Milk: ₹2,000");
        feeRepository.save(f1);

        StudentFeeRecord f2 = new StudentFeeRecord();
        f2.setStudentId(s1.getId());
        f2.setTermName("Term 2 (August - November 2026)");
        f2.setAmount(28500.0);
        f2.setDueDate(LocalDate.of(2026, 8, 10));
        f2.setPaidDate(LocalDate.of(2026, 8, 3));
        f2.setStatus("PAID");
        f2.setReceiptNumber("BBPS-2026-REC0580");
        f2.setPaymentMethod("Net Banking (SBI)");
        f2.setBreakdownJson("Tuition Fee: ₹22,000 | Activity & Sensory Kits: ₹4,500 | Nutritious Snack & Milk: ₹2,000");
        feeRepository.save(f2);
    }
}
