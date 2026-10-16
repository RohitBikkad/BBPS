package com.bbps.repository;

import com.bbps.model.StudentMoment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentMomentRepository extends JpaRepository<StudentMoment, Long> {
    List<StudentMoment> findByGradeAndSectionOrderByMomentDateDesc(String grade, String section);
    List<StudentMoment> findByGradeOrderByMomentDateDesc(String grade);
    List<StudentMoment> findByStudentIdOrderByMomentDateDesc(Long studentId);
}
