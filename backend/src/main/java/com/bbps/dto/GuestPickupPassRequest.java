package com.bbps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class GuestPickupPassRequest {

    @NotNull
    private Long studentId;

    @NotBlank
    private String guardianName;

    @NotBlank
    private String relation;

    @NotBlank
    private String phone;

    private String idProofNumber;

    private LocalDate validUntilDate;

    public GuestPickupPassRequest() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getGuardianName() { return guardianName; }
    public void setGuardianName(String guardianName) { this.guardianName = guardianName; }

    public String getRelation() { return relation; }
    public void setRelation(String relation) { this.relation = relation; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getIdProofNumber() { return idProofNumber; }
    public void setIdProofNumber(String idProofNumber) { this.idProofNumber = idProofNumber; }

    public LocalDate getValidUntilDate() { return validUntilDate; }
    public void setValidUntilDate(LocalDate validUntilDate) { this.validUntilDate = validUntilDate; }
}
