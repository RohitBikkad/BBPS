package com.bbps.repository;

import com.bbps.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByAdmissionNumber(String admissionNumber);
    List<Student> findByParentUserId(Long parentUserId);
    List<Student> findByParentEmail(String parentEmail);
    List<Student> findByGradeAndSection(String grade, String section);
    List<Student> findByGrade(String grade);
}
