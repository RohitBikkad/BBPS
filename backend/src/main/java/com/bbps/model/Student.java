package com.bbps.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_student_admission_no", columnList = "admission_number", unique = true),
    @Index(name = "idx_student_parent_user_id", columnList = "parent_user_id")
})
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admission_number", unique = true, nullable = false, length = 50)
    private String admissionNumber;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "grade", nullable = false, length = 50)
    private String grade; // e.g. "Nursery", "Playgroup", "LKG", "UKG"

    @Column(name = "section", nullable = false, length = 50)
    private String section; // e.g. "Butterflies", "Dolphins", "Sunshine"

    @Column(name = "roll_number", length = 20)
    private String rollNumber;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "allergies", length = 300)
    private String allergies;

    @Column(name = "pediatrician_contact", length = 150)
    private String pediatricianContact;

    @Column(name = "emergency_phone", length = 30)
    private String emergencyPhone;

    @Column(name = "parent_user_id")
    private Long parentUserId;

    @Column(name = "parent_name", length = 150)
    private String parentName;

    @Column(name = "parent_email", length = 150)
    private String parentEmail;

    @Column(name = "parent_phone", length = 30)
    private String parentPhone;

    @Column(name = "mother_teacher_name", length = 150)
    private String motherTeacherName;

    @Column(name = "school_bus_van_number", length = 50)
    private String schoolBusVanNumber;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Student() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAdmissionNumber() { return admissionNumber; }
    public void setAdmissionNumber(String admissionNumber) { this.admissionNumber = admissionNumber; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return firstName + " " + lastName; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getPediatricianContact() { return pediatricianContact; }
    public void setPediatricianContact(String pediatricianContact) { this.pediatricianContact = pediatricianContact; }

    public String getEmergencyPhone() { return emergencyPhone; }
    public void setEmergencyPhone(String emergencyPhone) { this.emergencyPhone = emergencyPhone; }

    public Long getParentUserId() { return parentUserId; }
    public void setParentUserId(Long parentUserId) { this.parentUserId = parentUserId; }

    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }

    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }

    public String getParentPhone() { return parentPhone; }
    public void setParentPhone(String parentPhone) { this.parentPhone = parentPhone; }

    public String getMotherTeacherName() { return motherTeacherName; }
    public void setMotherTeacherName(String motherTeacherName) { this.motherTeacherName = motherTeacherName; }

    public String getSchoolBusVanNumber() { return schoolBusVanNumber; }
    public void setSchoolBusVanNumber(String schoolBusVanNumber) { this.schoolBusVanNumber = schoolBusVanNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
