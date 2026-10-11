package com.bbps.repository;

import com.bbps.model.LeaveYearConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface LeaveYearConfigRepository extends JpaRepository<LeaveYearConfig, Long> {
    Optional<LeaveYearConfig> findByIsCurrentTrue();
    Optional<LeaveYearConfig> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(LocalDate d1, LocalDate d2);
}
