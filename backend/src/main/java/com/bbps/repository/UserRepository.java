package com.bbps.repository;

import com.bbps.model.AccountStatus;
import com.bbps.model.Role;
import com.bbps.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmployeeId(String employeeId);
    Optional<User> findByEmail(String email);
    Optional<User> findByEmployeeIdOrEmail(String employeeId, String email);
    boolean existsByEmployeeId(String employeeId);
    boolean existsByEmail(String email);

    List<User> findByRole(Role role);
    List<User> findBySupervisorEmployeeId(String supervisorEmployeeId);
    List<User> findByDepartment(String department);
    List<User> findByStatus(AccountStatus status);
}
