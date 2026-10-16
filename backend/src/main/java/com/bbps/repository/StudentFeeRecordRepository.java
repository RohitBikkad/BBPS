package com.bbps.repository;

import com.bbps.model.StudentFeeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentFeeRecordRepository extends JpaRepository<StudentFeeRecord, Long> {
    List<StudentFeeRecord> findByStudentIdOrderByDueDateDesc(Long studentId);
}
