package com.bbps.service;

import com.bbps.model.SchoolHoliday;
import com.bbps.repository.SchoolHolidayRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CalendarService {

    private final SchoolHolidayRepository holidayRepository;

    public CalendarService(SchoolHolidayRepository holidayRepository) {
        this.holidayRepository = holidayRepository;
    }

    public boolean isWorkingDay(LocalDate date) {
        Optional<SchoolHoliday> holiday = holidayRepository.findByHolidayDate(date);
        if (holiday.isPresent()) {
            if ("SPECIAL_WORKING_DAY".equalsIgnoreCase(holiday.get().getHolidayType())) {
                return true;
            }
            return false;
        }

        // Default Sunday is non-working
        DayOfWeek dow = date.getDayOfWeek();
        if (dow == DayOfWeek.SUNDAY) {
            return false;
        }

        return true;
    }

    public List<SchoolHoliday> getHolidays(LocalDate start, LocalDate end) {
        return holidayRepository.findByHolidayDateBetweenOrderByHolidayDateAsc(start, end);
    }

    public List<SchoolHoliday> getAllHolidays() {
        return holidayRepository.findAll();
    }

    @Transactional
    public SchoolHoliday addHoliday(SchoolHoliday holiday) {
        return holidayRepository.save(holiday);
    }

    @Transactional
    public void deleteHoliday(Long id) {
        holidayRepository.deleteById(id);
    }
}
