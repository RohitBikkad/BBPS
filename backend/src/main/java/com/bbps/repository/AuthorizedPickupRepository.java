package com.bbps.repository;

import com.bbps.model.AuthorizedPickup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorizedPickupRepository extends JpaRepository<AuthorizedPickup, Long> {
    List<AuthorizedPickup> findByStudentId(Long studentId);
    Optional<AuthorizedPickup> findByQrSecurityCode(String qrSecurityCode);
}
