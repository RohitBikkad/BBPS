package com.bbps.service;

import com.bbps.dto.GuestPickupPassRequest;
import com.bbps.dto.ParentDashboardDto;
import com.bbps.dto.QuickCareLogRequest;
import com.bbps.dto.StudentLeaveApplyRequest;
import com.bbps.exception.BadRequestException;
import com.bbps.exception.ResourceNotFoundException;
import com.bbps.model.*;
import com.bbps.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class StudentPortalService {

    private final StudentRepository studentRepository;
    private final StudentDailyCareLogRepository careLogRepository;
    private final StudentMomentRepository momentRepository;
    private final AuthorizedPickupRepository pickupRepository;
    private final DevelopmentalMilestoneRepository milestoneRepository;
    private final StudentLeaveRequestRepository leaveRequestRepository;
    private final StudentFeeRecordRepository feeRepository;
    private final PackTomorrowReminderRepository reminderRepository;
    private final UserRepository userRepository;

    public StudentPortalService(StudentRepository studentRepository,
                                StudentDailyCareLogRepository careLogRepository,
                                StudentMomentRepository momentRepository,
                                AuthorizedPickupRepository pickupRepository,
                                DevelopmentalMilestoneRepository milestoneRepository,
                                StudentLeaveRequestRepository leaveRequestRepository,
                                StudentFeeRecordRepository feeRepository,
                                PackTomorrowReminderRepository reminderRepository,
                                UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.careLogRepository = careLogRepository;
        this.momentRepository = momentRepository;
        this.pickupRepository = pickupRepository;
        this.milestoneRepository = milestoneRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.feeRepository = feeRepository;
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public ParentDashboardDto getParentDashboard(String username, Long requestedStudentId) {
        User user = userRepository.findByEmployeeIdOrEmail(username, username)
                .orElse(null);

        List<Student> linkedStudents = new ArrayList<>();
        if (user != null) {
            linkedStudents = studentRepository.findByParentUserId(user.getId());
            if (linkedStudents.isEmpty()) {
                linkedStudents = studentRepository.findByParentEmail(user.getEmail());
            }
        }

        // If no students explicitly linked or admin/demo viewer, pick first student
        if (linkedStudents.isEmpty()) {
            linkedStudents = studentRepository.findAll();
            if (linkedStudents.isEmpty()) {
                throw new ResourceNotFoundException("No students found in system");
            }
        }

        Student activeStudent = linkedStudents.get(0);
        if (requestedStudentId != null) {
            for (Student s : linkedStudents) {
                if (s.getId().equals(requestedStudentId)) {
                    activeStudent = s;
                    break;
                }
            }
        }

        List<Student> siblings = new ArrayList<>(linkedStudents);
        Student current = activeStudent;
        siblings.removeIf(s -> s.getId().equals(current.getId()));

        LocalDate today = LocalDate.now();
        StudentDailyCareLog todayLog = careLogRepository.findByStudentIdAndLogDate(activeStudent.getId(), today)
                .orElseGet(() -> {
                    // Create in-memory preview if not yet marked today
                    StudentDailyCareLog mock = new StudentDailyCareLog();
                    mock.setStudentId(current.getId());
                    mock.setLogDate(today);
                    mock.setAttendanceStatus("PRESENT");
                    mock.setCheckInTime("08:45 AM");
                    mock.setMealStatus("FINISHED_ALL");
                    mock.setMealNotes("Finished vegetable upma & fresh papaya slices");
                    mock.setNapMinutes(45);
                    mock.setNapNotes("Rested peacefully during quiet time");
                    mock.setMood("HAPPY");
                    mock.setTemperature("98.4 °F");
                    mock.setMedicationGiven(false);
                    mock.setActivitiesSummary("Finger painting with yellow & blue, shape puzzle matching, circle rhyme session.");
                    mock.setTeacherNotes("Aarav was very enthusiastic during music time and shared blocks nicely!");
                    return mock;
                });

        List<StudentDailyCareLog> recentLogs = careLogRepository.findByStudentIdOrderByLogDateDesc(activeStudent.getId());
        List<StudentMoment> moments = momentRepository.findByGradeAndSectionOrderByMomentDateDesc(
                activeStudent.getGrade(), activeStudent.getSection()
        );
        if (moments.isEmpty()) {
            moments = momentRepository.findByGradeOrderByMomentDateDesc(activeStudent.getGrade());
        }

        List<AuthorizedPickup> pickups = pickupRepository.findByStudentId(activeStudent.getId());
        List<DevelopmentalMilestone> milestones = milestoneRepository.findByStudentId(activeStudent.getId());
        List<StudentLeaveRequest> leaves = leaveRequestRepository.findByStudentIdOrderByCreatedAtDesc(activeStudent.getId());
        List<StudentFeeRecord> fees = feeRepository.findByStudentIdOrderByDueDateDesc(activeStudent.getId());

        List<PackTomorrowReminder> reminders = reminderRepository.findByGradeAndSectionOrderByTargetDateDesc(
                activeStudent.getGrade(), activeStudent.getSection()
        );
        PackTomorrowReminder tomorrowReminder = reminders.isEmpty() ? null : reminders.get(0);

        ParentDashboardDto dto = new ParentDashboardDto();
        dto.setStudent(activeStudent);
        dto.setSiblings(siblings);
        dto.setTodayLog(todayLog);
        dto.setRecentLogs(recentLogs);
        dto.setRecentMoments(moments);
        dto.setAuthorizedPickups(pickups);
        dto.setMilestones(milestones);
        dto.setRecentLeaves(leaves);
        dto.setFeeRecords(fees);
        dto.setTomorrowReminder(tomorrowReminder);

        return dto;
    }

    @Transactional(readOnly = true)
    public List<StudentDailyCareLog> getRecentLogs(Long studentId) {
        return careLogRepository.findByStudentIdOrderByLogDateDesc(studentId);
    }

    @Transactional
    public AuthorizedPickup createGuestPickupPass(String username, GuestPickupPassRequest req) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        AuthorizedPickup pickup = new AuthorizedPickup();
        pickup.setStudentId(student.getId());
        pickup.setGuardianName(req.getGuardianName().trim());
        pickup.setRelation(req.getRelation().trim());
        pickup.setPhone(req.getPhone().trim());
        pickup.setIdProofNumber(req.getIdProofNumber());
        pickup.setIsPrimary(false);
        pickup.setIsTemporary(true);
        pickup.setValidUntilDate(req.getValidUntilDate() != null ? req.getValidUntilDate() : LocalDate.now());
        pickup.setStatus("ACTIVE");

        String qrCode = "PASS-" + student.getAdmissionNumber() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        pickup.setQrSecurityCode(qrCode);

        return pickupRepository.save(pickup);
    }

    @Transactional
    public StudentLeaveRequest applyStudentLeave(String username, StudentLeaveApplyRequest req) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (req.getEndDate().isBefore(req.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        long days = ChronoUnit.DAYS.between(req.getStartDate(), req.getEndDate()) + 1;

        User user = userRepository.findByEmployeeIdOrEmail(username, username).orElse(null);

        StudentLeaveRequest leave = new StudentLeaveRequest();
        leave.setStudentId(student.getId());
        leave.setParentUserId(user != null ? user.getId() : null);
        leave.setStartDate(req.getStartDate());
        leave.setEndDate(req.getEndDate());
        leave.setTotalDays((int) days);
        leave.setReasonType(req.getReasonType());
        leave.setReasonDetails(req.getReasonDetails());
        leave.setStatus("PENDING");

        return leaveRequestRepository.save(leave);
    }

    @Transactional
    public StudentDailyCareLog quickUpdateCareLog(String staffId, QuickCareLogRequest req) {
        Student student = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + req.getStudentId()));

        LocalDate date = req.getLogDate() != null ? req.getLogDate() : LocalDate.now();

        StudentDailyCareLog log = careLogRepository.findByStudentIdAndLogDate(student.getId(), date)
                .orElse(new StudentDailyCareLog());

        log.setStudentId(student.getId());
        log.setLogDate(date);
        log.setRecordedByStaffId(staffId);

        if (req.getCheckInTime() != null) log.setCheckInTime(req.getCheckInTime());
        if (req.getCheckOutTime() != null) log.setCheckOutTime(req.getCheckOutTime());
        if (req.getAttendanceStatus() != null) log.setAttendanceStatus(req.getAttendanceStatus());
        if (req.getMealStatus() != null) log.setMealStatus(req.getMealStatus());
        if (req.getMealNotes() != null) log.setMealNotes(req.getMealNotes());
        if (req.getNapMinutes() != null) log.setNapMinutes(req.getNapMinutes());
        if (req.getNapNotes() != null) log.setNapNotes(req.getNapNotes());
        if (req.getMood() != null) log.setMood(req.getMood());
        if (req.getTemperature() != null) log.setTemperature(req.getTemperature());
        if (req.getMedicationGiven() != null) log.setMedicationGiven(req.getMedicationGiven());
        if (req.getMedicationNotes() != null) log.setMedicationNotes(req.getMedicationNotes());
        if (req.getActivitiesSummary() != null) log.setActivitiesSummary(req.getActivitiesSummary());
        if (req.getTeacherNotes() != null) log.setTeacherNotes(req.getTeacherNotes());

        return careLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getClassDailySheet(String grade, String section, LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<Student> students = studentRepository.findByGradeAndSection(grade, section);
        if (students.isEmpty()) {
            students = studentRepository.findByGrade(grade);
        }

        List<Long> ids = students.stream().map(Student::getId).toList();
        List<StudentDailyCareLog> logs = ids.isEmpty() ? Collections.emptyList() :
                careLogRepository.findByStudentIdInAndLogDate(ids, targetDate);

        Map<Long, StudentDailyCareLog> logMap = new HashMap<>();
        for (StudentDailyCareLog l : logs) {
            logMap.put(l.getStudentId(), l);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("grade", grade);
        result.put("section", section);
        result.put("date", targetDate);
        result.put("students", students);
        result.put("careLogs", logMap);

        return result;
    }

    @Transactional
    public StudentMoment createMoment(StudentMoment moment, String staffId) {
        moment.setCreatedByStaffId(staffId);
        return momentRepository.save(moment);
    }

    @Transactional
    public PackTomorrowReminder createReminder(PackTomorrowReminder reminder, String staffId) {
        reminder.setCreatedByStaffId(staffId);
        return reminderRepository.save(reminder);
    }

    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Transactional
    public Student addStudent(Student student) {
        if (student.getAdmissionNumber() == null || student.getAdmissionNumber().isBlank()) {
            student.setAdmissionNumber("BBPS-" + LocalDate.now().getYear() + "-S" + (studentRepository.count() + 1));
        }
        return studentRepository.save(student);
    }

    @Transactional
    public DevelopmentalMilestone awardMilestone(DevelopmentalMilestone milestone) {
        if (milestone.getEvaluatedDate() == null) {
            milestone.setEvaluatedDate(LocalDate.now());
        }
        return milestoneRepository.save(milestone);
    }

    @Transactional(readOnly = true)
    public List<StudentLeaveRequest> getAllStudentLeaves() {
        return leaveRequestRepository.findAll();
    }

    @Transactional
    public StudentLeaveRequest updateLeaveStatus(Long leaveId, String status, String remarks, String staffId) {
        StudentLeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));
        leave.setStatus(status);
        leave.setTeacherRemarks(remarks);
        leave.setReviewedByStaffId(staffId);
        return leaveRequestRepository.save(leave);
    }

    @Transactional
    public List<StudentDailyCareLog> bulkAttendance(String grade, String section, LocalDate date, String status, String checkInTime, String staffId) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<Student> students = studentRepository.findByGradeAndSection(grade, section);
        if (students.isEmpty()) {
            students = studentRepository.findByGrade(grade);
        }

        List<StudentDailyCareLog> updated = new ArrayList<>();
        for (Student s : students) {
            StudentDailyCareLog log = careLogRepository.findByStudentIdAndLogDate(s.getId(), targetDate)
                    .orElse(new StudentDailyCareLog());
            log.setStudentId(s.getId());
            log.setLogDate(targetDate);
            log.setAttendanceStatus(status != null ? status : "PRESENT");
            if (checkInTime != null) {
                log.setCheckInTime(checkInTime);
            } else if ("PRESENT".equalsIgnoreCase(status) && log.getCheckInTime() == null) {
                log.setCheckInTime("08:40 AM");
            }
            log.setRecordedByStaffId(staffId);
            updated.add(careLogRepository.save(log));
        }
        return updated;
    }
}
