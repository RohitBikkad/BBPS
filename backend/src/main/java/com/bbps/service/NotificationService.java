package com.bbps.service;

import com.bbps.model.Notification;
import com.bbps.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public void createNotification(String employeeId, String title, String message, String type) {
        Notification notification = new Notification(employeeId, title, message, type);
        notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForEmployee(String employeeId) {
        return notificationRepository.findTop20ByEmployeeIdOrderByCreatedAtDesc(employeeId);
    }

    public long getUnreadCount(String employeeId) {
        return notificationRepository.countByEmployeeIdAndIsReadFalse(employeeId);
    }

    @Transactional
    public void markAllAsRead(String employeeId) {
        List<Notification> list = notificationRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
        for (Notification n : list) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(list);
    }

    @Transactional
    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }
}
