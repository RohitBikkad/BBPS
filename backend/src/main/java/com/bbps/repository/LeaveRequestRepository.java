package com.bbps.repository;

import com.bbps.model.LeaveRequest;
import com.bbps.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(String employeeId);
    List<LeaveRequest> findByFinalStatusOrderByCreatedAtDesc(LeaveStatus finalStatus);

    @Query("SELECT l FROM LeaveRequest l WHERE l.employeeId IN :employeeIds ORDER BY l.createdAt DESC")
    List<LeaveRequest> findByEmployeeIdsOrderByCreatedAtDesc(@Param("employeeIds") List<String> employeeIds);

    List<LeaveRequest> findAllByOrderByCreatedAtDesc();

    @Query("SELECT l FROM LeaveRequest l WHERE l.employeeId = :employeeId AND l.finalStatus = 'APPROVED' AND :date BETWEEN l.startDate AND l.endDate")
    List<LeaveRequest> findApprovedLeavesForEmployeeOnDate(@Param("employeeId") String employeeId, @Param("date") LocalDate date);

    @Query("SELECT l FROM LeaveRequest l WHERE l.finalStatus = 'APPROVED' AND :date BETWEEN l.startDate AND l.endDate")
    List<LeaveRequest> findAllApprovedLeavesOnDate(@Param("date") LocalDate date);

    @Query("SELECT l FROM LeaveRequest l WHERE l.employeeId = :employeeId AND l.finalStatus NOT IN ('REJECTED', 'CANCELLED') AND ((l.startDate BETWEEN :start AND :end) OR (l.endDate BETWEEN :start AND :end) OR (:start BETWEEN l.startDate AND l.endDate))")
    List<LeaveRequest> findOverlappingLeaves(@Param("employeeId") String employeeId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    long countByFinalStatus(LeaveStatus finalStatus);
    long countByEmployeeIdAndFinalStatus(String employeeId, LeaveStatus finalStatus);
}
