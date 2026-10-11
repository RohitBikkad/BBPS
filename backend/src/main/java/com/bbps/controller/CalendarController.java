package com.bbps.controller;

import com.bbps.model.SchoolHoliday;
import com.bbps.service.CalendarService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping("/holidays")
    public ResponseEntity<List<SchoolHoliday>> getHolidays(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(calendarService.getHolidays(startDate, endDate));
        }
        return ResponseEntity.ok(calendarService.getAllHolidays());
    }

    @GetMapping("/is-working-day")
    public ResponseEntity<Map<String, Object>> isWorkingDay(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        boolean working = calendarService.isWorkingDay(date);
        return ResponseEntity.ok(Map.of("date", date, "isWorkingDay", working));
    }

    @PostMapping("/holidays")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<SchoolHoliday> addHoliday(@RequestBody SchoolHoliday holiday) {
        return ResponseEntity.ok(calendarService.addHoliday(holiday));
    }

    @DeleteMapping("/holidays/{id}")
    @PreAuthorize("hasRole('PRINCIPAL')")
    public ResponseEntity<Map<String, String>> deleteHoliday(@PathVariable Long id) {
        calendarService.deleteHoliday(id);
        return ResponseEntity.ok(Map.of("message", "Holiday deleted successfully"));
    }
}
