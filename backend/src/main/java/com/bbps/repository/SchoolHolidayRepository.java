package com.bbps.repository;

import com.bbps.model.SchoolHoliday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolHolidayRepository extends JpaRepository<SchoolHoliday, Long> {
    Optional<SchoolHoliday> findByHolidayDate(LocalDate holidayDate);
    List<SchoolHoliday> findByHolidayDateBetweenOrderByHolidayDateAsc(LocalDate start, LocalDate end);
    boolean existsByHolidayDate(LocalDate holidayDate);
}
