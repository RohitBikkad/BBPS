package com.bbps.repository;

import com.bbps.model.DevelopmentalMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DevelopmentalMilestoneRepository extends JpaRepository<DevelopmentalMilestone, Long> {
    List<DevelopmentalMilestone> findByStudentId(Long studentId);
    List<DevelopmentalMilestone> findByStudentIdAndTerm(Long studentId, String term);
}
