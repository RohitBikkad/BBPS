package com.bbps.repository;

import com.bbps.model.StudentLeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentLeaveRequestRepository extends JpaRepository<StudentLeaveRequest, Long> {
    List<StudentLeaveRequest> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<StudentLeaveRequest> findByStatus(String status);
}
