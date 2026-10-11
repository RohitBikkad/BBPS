package com.bbps.service;

import com.bbps.dto.StaffDto;
import com.bbps.exception.BadRequestException;
import com.bbps.exception.ResourceNotFoundException;
import com.bbps.model.AccountStatus;
import com.bbps.model.Role;
import com.bbps.model.User;
import com.bbps.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<StaffDto> getAllStaff() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<StaffDto> getSupervisors() {
        return userRepository.findByRole(Role.ROLE_SUPERVISOR).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<StaffDto> getAssignedStaff(String supervisorEmployeeId) {
        return userRepository.findBySupervisorEmployeeId(supervisorEmployeeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StaffDto getStaffByEmployeeId(String employeeId) {
        User user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with ID: " + employeeId));
        return mapToDto(user);
    }

    @Transactional
    public StaffDto createStaff(StaffDto dto) {
        if (userRepository.existsByEmployeeId(dto.getEmployeeId())) {
            throw new BadRequestException("Employee ID already exists: " + dto.getEmployeeId());
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already in use: " + dto.getEmail());
        }

        User user = new User();
        user.setEmployeeId(dto.getEmployeeId());
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword() != null && !dto.getPassword().isBlank() ? dto.getPassword() : "School@123"));
        user.setMobileNumber(dto.getMobileNumber());
        user.setDepartment(dto.getDepartment());
        user.setDesignation(dto.getDesignation());
        user.setJoiningDate(dto.getJoiningDate());
        user.setSupervisorEmployeeId(dto.getSupervisorEmployeeId());
        user.setRole(dto.getRole() != null ? dto.getRole() : Role.ROLE_STAFF);
        user.setStatus(dto.getStatus() != null ? dto.getStatus() : AccountStatus.ACTIVE);
        user.setPaidLeaveBalance(dto.getPaidLeaveBalance() != null ? dto.getPaidLeaveBalance() : 8);

        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    @Transactional
    public StaffDto updateStaff(String employeeId, StaffDto dto) {
        User user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with ID: " + employeeId));

        user.setFullName(dto.getFullName());
        user.setMobileNumber(dto.getMobileNumber());
        user.setDepartment(dto.getDepartment());
        user.setDesignation(dto.getDesignation());
        if (dto.getJoiningDate() != null) {
            user.setJoiningDate(dto.getJoiningDate());
        }
        user.setSupervisorEmployeeId(dto.getSupervisorEmployeeId());
        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }
        if (dto.getStatus() != null) {
            user.setStatus(dto.getStatus());
        }
        if (dto.getPaidLeaveBalance() != null) {
            user.setPaidLeaveBalance(dto.getPaidLeaveBalance());
        }
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    @Transactional
    public StaffDto toggleStatus(String employeeId, AccountStatus newStatus) {
        User user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with ID: " + employeeId));
        user.setStatus(newStatus);
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public void assignSupervisor(String employeeId, String supervisorEmployeeId) {
        User user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with ID: " + employeeId));
        user.setSupervisorEmployeeId(supervisorEmployeeId);
        userRepository.save(user);
    }

    @Transactional
    public void resetPassword(String employeeId, String newPassword) {
        User user = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with ID: " + employeeId));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public StaffDto mapToDto(User user) {
        StaffDto dto = new StaffDto();
        dto.setId(user.getId());
        dto.setEmployeeId(user.getEmployeeId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setMobileNumber(user.getMobileNumber());
        dto.setDepartment(user.getDepartment());
        dto.setDesignation(user.getDesignation());
        dto.setJoiningDate(user.getJoiningDate());
        dto.setSupervisorEmployeeId(user.getSupervisorEmployeeId());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setPaidLeaveBalance(user.getPaidLeaveBalance());

        if (user.getSupervisorEmployeeId() != null) {
            userRepository.findByEmployeeId(user.getSupervisorEmployeeId())
                    .ifPresent(sup -> dto.setSupervisorName(sup.getFullName()));
        }

        return dto;
    }
}
