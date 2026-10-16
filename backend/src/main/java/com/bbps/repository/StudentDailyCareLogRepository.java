package com.bbps.repository;

import com.bbps.model.StudentDailyCareLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentDailyCareLogRepository extends JpaRepository<StudentDailyCareLog, Long> {
    Optional<StudentDailyCareLog> findByStudentIdAndLogDate(Long studentId, LocalDate logDate);
    List<StudentDailyCareLog> findByStudentIdOrderByLogDateDesc(Long studentId);
    List<StudentDailyCareLog> findByStudentIdInAndLogDate(List<Long> studentIds, LocalDate logDate);
}
