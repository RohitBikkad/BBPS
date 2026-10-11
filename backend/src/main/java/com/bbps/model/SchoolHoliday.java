package com.bbps.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "school_holidays", uniqueConstraints = {
    @UniqueConstraint(name = "uk_holiday_date", columnNames = {"holiday_date"})
})
public class SchoolHoliday {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "holiday_date", nullable = false)
    private LocalDate holidayDate;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "holiday_type", nullable = false, length = 50)
    private String holidayType; // HOLIDAY, WEEKEND, SPECIAL_WORKING_DAY

    @Column(name = "description", length = 500)
    private String description;

    public SchoolHoliday() {
    }

    public SchoolHoliday(LocalDate holidayDate, String name, String holidayType, String description) {
        this.holidayDate = holidayDate;
        this.name = name;
        this.holidayType = holidayType;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getHolidayDate() {
        return holidayDate;
    }

    public void setHolidayDate(LocalDate holidayDate) {
        this.holidayDate = holidayDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHolidayType() {
        return holidayType;
    }

    public void setHolidayType(String holidayType) {
        this.holidayType = holidayType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
