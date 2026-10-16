package com.bbps.repository;

import com.bbps.model.PackTomorrowReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PackTomorrowReminderRepository extends JpaRepository<PackTomorrowReminder, Long> {
    List<PackTomorrowReminder> findByGradeAndSectionOrderByTargetDateDesc(String grade, String section);
    List<PackTomorrowReminder> findByGradeAndTargetDateGreaterThanEqualOrderByTargetDateAsc(String grade, LocalDate fromDate);
}
