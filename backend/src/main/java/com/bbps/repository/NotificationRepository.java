package com.bbps.repository;

import com.bbps.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByEmployeeIdOrderByCreatedAtDesc(String employeeId);
    List<Notification> findTop20ByEmployeeIdOrderByCreatedAtDesc(String employeeId);
    long countByEmployeeIdAndIsReadFalse(String employeeId);
}
