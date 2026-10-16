package com.bbps.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "authorized_pickups", indexes = {
    @Index(name = "idx_pickup_student_id", columnList = "student_id")
})
public class AuthorizedPickup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "guardian_name", nullable = false, length = 150)
    private String guardianName;

    @Column(name = "relation", nullable = false, length = 50)
    private String relation; // Father, Mother, Grandfather, Grandmother, Van Attendant, Guardian

    @Column(name = "phone", nullable = false, length = 30)
    private String phone;

    @Column(name = "id_proof_number", length = 100)
    private String idProofNumber;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Column(name = "is_temporary")
    private Boolean isTemporary = false;

    @Column(name = "valid_until_date")
    private LocalDate validUntilDate;

    @Column(name = "qr_security_code", length = 100)
    private String qrSecurityCode;

    @Column(name = "status", length = 30)
    private String status = "ACTIVE"; // ACTIVE, EXPIRED, REVOKED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AuthorizedPickup() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }

    public Boolean getIsTemporary() { return isTemporary; }
    public void setIsTemporary(Boolean isTemporary) { this.isTemporary = isTemporary; }

    public LocalDate getValidUntilDate() { return validUntilDate; }
    public void setValidUntilDate(LocalDate validUntilDate) { this.validUntilDate = validUntilDate; }

    public String getQrSecurityCode() { return qrSecurityCode; }
    public void setQrSecurityCode(String qrSecurityCode) { this.qrSecurityCode = qrSecurityCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
