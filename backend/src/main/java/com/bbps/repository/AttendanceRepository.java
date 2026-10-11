package com.bbps.repository;

import com.bbps.model.ApprovalStatus;
import com.bbps.model.Attendance;
import com.bbps.model.FinalAttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeIdAndAttendanceDate(String employeeId, LocalDate attendanceDate);
    boolean existsByEmployeeIdAndAttendanceDate(String employeeId, LocalDate attendanceDate);

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
    List<Attendance> findByAttendanceDateAndApprovalStatus(LocalDate attendanceDate, ApprovalStatus approvalStatus);

    List<Attendance> findByEmployeeIdOrderByAttendanceDateDesc(String employeeId);
    List<Attendance> findByEmployeeIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(String employeeId, LocalDate start, LocalDate end);

    List<Attendance> findByAttendanceDateBetweenOrderByAttendanceDateDesc(LocalDate start, LocalDate end);

    @Query("SELECT a FROM Attendance a WHERE a.employeeId IN :employeeIds AND a.attendanceDate = :date")
    List<Attendance> findByEmployeeIdsAndDate(@Param("employeeIds") List<String> employeeIds, @Param("date") LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.employeeId IN :employeeIds AND a.attendanceDate BETWEEN :startDate AND :endDate")
    List<Attendance> findByEmployeeIdsAndDateBetween(@Param("employeeIds") List<String> employeeIds,
                                                    @Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate);

    long countByAttendanceDateAndApprovalStatus(LocalDate date, ApprovalStatus approvalStatus);
    long countByAttendanceDateAndFinalStatus(LocalDate date, FinalAttendanceStatus finalStatus);

    long countByEmployeeIdAndFinalStatus(String employeeId, FinalAttendanceStatus finalStatus);
    long countByEmployeeIdAndAttendanceDateBetweenAndFinalStatus(String employeeId, LocalDate start, LocalDate end, FinalAttendanceStatus finalStatus);
}
