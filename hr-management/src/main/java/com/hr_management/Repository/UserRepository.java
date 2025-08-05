package com.hr_management.Repository;

import com.hr_management.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    List<User> findByDepartment(String department);

    long countByDepartment(String department);

    long countByRole(String role);

    Optional<User> findByDepartmentAndRole(String department, String role);

    List<User> findByRole(String role);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByEmployeeId(String employeeId);

    Optional<User> findByEmail(String email);

    List<User> findByRoleIgnoreCase(String role);
    List<User> findByRoleIgnoreCaseAndStatus(String role, String status);
    List<User> findByRoleIgnoreCaseAndDepartmentAndStatus(String role, String department, String status);

    @Query("SELECT u FROM User u WHERE u.department = :department AND u.reportingTo.id = :reportingToId")
    List<User> findByDepartmentAndReportingToId(@Param("department") String department, @Param("reportingToId") Long reportingToId);

    List<User> findByStatus(String status);

    List<User> findByProfileVerificationStatusIn(List<String> statuses);

    // --- ADD THIS NEW METHOD ---
    List<User> findByProfileVerificationStatus(String status);
}