package com.bbps.repository;

import com.bbps.model.AttendanceAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceAuditRepository extends JpaRepository<AttendanceAudit, Long> {
    List<AttendanceAudit> findByAttendanceIdOrderByChangedAtDesc(Long attendanceId);
    List<AttendanceAudit> findByEmployeeIdOrderByChangedAtDesc(String employeeId);
    List<AttendanceAudit> findByAttendanceDateOrderByChangedAtDesc(LocalDate attendanceDate);
    List<AttendanceAudit> findAllByOrderByChangedAtDesc();
}
