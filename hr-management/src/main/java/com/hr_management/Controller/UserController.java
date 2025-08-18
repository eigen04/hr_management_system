package com.hr_management.Controller;

import com.hr_management.Entity.Department;
import com.hr_management.Entity.PendingSignup;
import com.hr_management.Entity.User;
import com.hr_management.Repository.DocumentRepository;
import com.hr_management.service.DepartmentService;
import com.hr_management.service.UserService;
import com.hr_management.dto.UserDTO;
// --- Add these required imports ---
import com.hr_management.Entity.Document;
import com.hr_management.dto.DocumentDTO;
// ---
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;
    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/users/all")
    @PreAuthorize("hasRole('HR') or hasRole('SUPER_ADMIN')") // Only HR and Super Admin can get the full list
    public ResponseEntity<List<UserDTO>> getAllUsersForDropdown() {
        logger.info("Fetching all users for dropdown");
        try {
            List<UserDTO> users = userService.getAllUsersSimple();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Error fetching all users: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }
    // Paste this new method inside your UserController.java class

    @GetMapping("/users/directory")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<List<UserDTO>> getAllUsersForDirectory() {
        logger.info("Received request for /api/users/directory");
        try {
            List<UserDTO> users = userService.getAllUsersForDirectory();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Error fetching users for directory: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    // --- The method below is the one we are fixing ---
    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUser() {
        logger.info("Received request for /api/users/me");
        try {
            User user = userService.getCurrentUser();
            UserDTO userDTO = new UserDTO();

            // Set existing fields
            userDTO.setId(user.getId());
            userDTO.setFullName(user.getFullName());
            userDTO.setUsername(user.getUsername());
            userDTO.setEmail(user.getEmail());
            userDTO.setDepartment(user.getDepartment());
            userDTO.setRole(user.getRole());
            userDTO.setGender(user.getGender());
            userDTO.setJoinDate(user.getJoinDate());
            userDTO.setEmployeeId(user.getEmployeeId());
            userDTO.setStatus(user.getStatus());
            userDTO.setDisapproveReason(user.getDisapproveReason());
            if (user.getReportingTo() != null) {
                userDTO.setReportingToId(user.getReportingTo().getId());
                userDTO.setReportingToName(user.getReportingTo().getFullName());
            }

            // --- START: ADDED CODE TO FIX THE PROBLEM ---

            // 1. Populate the missing profile fields from the User entity
            userDTO.setProfileVerificationStatus(user.getProfileVerificationStatus());
            userDTO.setDob(user.getDob());
            userDTO.setFatherName(user.getFatherName());
            userDTO.setMotherName(user.getMotherName());
            userDTO.setEmergencyContactNumber(user.getEmergencyContactNumber());
            userDTO.setIsFresher(user.getIsFresher());

            // 2. Fetch and populate the user's documents
            List<Document> userDocuments = documentRepository.findByUserId(user.getId());
            List<DocumentDTO> documentDTOs = userDocuments.stream()
                    .map(doc -> new DocumentDTO(
                            doc.getDocumentType(),
                            doc.getCustomDocumentName(),
                            java.nio.file.Paths.get(doc.getFilePath()).getFileName().toString(),
                            doc.getIsPreviousCompany()
                    ))
                    .collect(Collectors.toList());
            userDTO.setDocuments(documentDTOs);

            // --- END: ADDED CODE ---

            logger.debug("Returning complete user DTO: {}", userDTO);
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            logger.error("Error fetching current user: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Failed to fetch user: " + e.getMessage()));
        }
    }

    // --- The rest of your file remains the same ---

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        logger.info("Fetching all departments");
        List<Department> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/departments/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        logger.info("Fetching department with id: {}", id);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userService.getCurrentUser();
        String userRole = currentUser.getRole();
        String userDepartment = currentUser.getDepartment();

        Optional<Department> departmentOpt = departmentService.getDepartmentById(id);
        if (departmentOpt.isEmpty()) {
            logger.warn("Department not found with id: {}", id);
            return ResponseEntity.status(404).body(null);
        }
        Department department = departmentOpt.get();

        if (userRole.equals("ASSISTANT_DIRECTOR")) {
            if (!department.getName().equals(userDepartment)) {
                logger.warn("Access denied for user {} to department {}", username, department.getName());
                return ResponseEntity.status(403).body(null);
            }
        }

        return ResponseEntity.ok(department);
    }

    @GetMapping("/users/hods")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<List<UserDTO>> getHods() {
        logger.info("Fetching HODs");
        try {
            List<User> hods = userService.getHods();
            List<UserDTO> hodDTOs = hods.stream().map(user -> {
                UserDTO dto = new UserDTO();
                dto.setId(user.getId());
                dto.setFullName(user.getFullName());
                dto.setUsername(user.getUsername());
                dto.setEmail(user.getEmail());
                dto.setDepartment(user.getDepartment());
                dto.setRole(user.getRole());
                dto.setGender(user.getGender());
                dto.setJoinDate(user.getJoinDate());
                dto.setEmployeeId(user.getEmployeeId());
                dto.setStatus(user.getStatus());
                dto.setDisapproveReason(user.getDisapproveReason());
                if (user.getReportingTo() != null) {
                    dto.setReportingToId(user.getReportingTo().getId());
                    dto.setReportingToName(user.getReportingTo().getFullName());
                }
                return dto;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(hodDTOs);
        } catch (Exception e) {
            logger.error("Error fetching HODs: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }

    @PatchMapping("/users/{id}/status")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        logger.info("Updating user status for id: {}", id);
        try {
            String newStatus = statusUpdate.get("status");
            userService.updateUserStatus(id, newStatus);
            return ResponseEntity.ok(Collections.singletonMap("message", "User status updated successfully"));
        } catch (RuntimeException e) {
            logger.warn("Failed to update user status: {}", e.getMessage());
            return ResponseEntity.status(400).body(Collections.singletonMap("message", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error updating user status: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Collections.singletonMap("message", "An error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/users/subordinates")
    public ResponseEntity<List<User>> getSubordinates() {
        logger.info("Fetching subordinates for current user");
        User currentUser = userService.getCurrentUser();
        List<User> subordinates = currentUser.getSubordinates();
        return ResponseEntity.ok(subordinates);
    }

    @GetMapping("/hr/pending-signups")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<List<UserDTO>> getPendingSignups() {
        logger.info("Fetching pending signups");
        try {
            List<PendingSignup> pendingSignups = userService.getPendingUsers(); // Update to PendingSignup
            List<UserDTO> userDTOs = pendingSignups.stream().map(pending -> {
                UserDTO dto = new UserDTO();
                dto.setId(pending.getId());
                dto.setFullName(pending.getFullName());
                dto.setUsername(pending.getUsername());
                dto.setEmail(pending.getEmail());
                dto.setDepartment(pending.getDepartment());
                dto.setRole(pending.getRole());
                dto.setGender(pending.getGender());
                dto.setJoinDate(pending.getJoinDate());
                dto.setEmployeeId(pending.getEmployeeId());
                dto.setStatus(pending.getStatus());
                dto.setDisapproveReason(pending.getReason());
                if (pending.getReportingTo() != null) {
                    dto.setReportingToId(pending.getReportingTo().getId());
                    dto.setReportingToName(pending.getReportingTo().getFullName());
                }
                return dto;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            logger.error("Error fetching pending signups: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }

    @PostMapping("/hr/approve-signup/{userId}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> approveSignup(@PathVariable Long userId) {
        logger.info("Approving signup for user id: {}", userId);
        try {
            userService.approveUser(userId);
            return ResponseEntity.ok(new AuthController.SuccessResponse("User approved successfully"));
        } catch (IllegalArgumentException e) {
            logger.warn("Failed to approve signup: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new AuthController.ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error approving signup: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new AuthController.ErrorResponse("An error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/hr/disapprove-signup/{userId}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> disapproveSignup(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        logger.info("Disapproving signup for user id: {}", userId);
        String reason = request.get("reason");
        if (reason == null || reason.trim().isEmpty()) {
            logger.warn("Disapproval reason is required");
            return ResponseEntity.badRequest().body(new AuthController.ErrorResponse("Reason for disapproval is required"));
        }
        try {
            userService.rejectUser(userId, reason);
            return ResponseEntity.ok(new AuthController.SuccessResponse("Signup request rejected successfully"));
        } catch (IllegalArgumentException e) {
            logger.warn("Failed to disapprove signup: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new AuthController.ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error disapproving signup: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new AuthController.ErrorResponse("An error occurred: " + e.getMessage()));
        }
    }

    @DeleteMapping("/hr/delete-signup/{userId}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> deleteSignup(@PathVariable Long userId) {
        logger.info("Deleting signup for user id: {}", userId);
        try {
            userService.deletePendingSignup(userId);
            return ResponseEntity.ok(new AuthController.SuccessResponse("Signup request deleted successfully"));
        } catch (IllegalArgumentException e) {
            logger.warn("Failed to delete signup: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new AuthController.ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error deleting signup: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new AuthController.ErrorResponse("An error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/superadmin/approve-hr-signup/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> approveHrSignup(@PathVariable Long userId) {
        logger.info("Super Admin approving HR signup for user id: {}", userId);
        try {
            userService.approveUser(userId); // Reuses existing approveUser method
            return ResponseEntity.ok(new AuthController.SuccessResponse("HR user approved successfully by Super Admin"));
        } catch (IllegalArgumentException e) {
            logger.warn("Failed to approve HR signup: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new AuthController.ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error approving HR signup: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new AuthController.ErrorResponse("An error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/superadmin/disapprove-hr-signup/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> disapproveHrSignup(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        logger.info("Super Admin disapproving HR signup for user id: {}", userId);
        String reason = request.get("reason");
        if (reason == null || reason.trim().isEmpty()) {
            logger.warn("Disapproval reason is required");
            return ResponseEntity.badRequest().body(new AuthController.ErrorResponse("Reason for disapproval is required"));
        }
        try {
            userService.rejectUser(userId, reason);
            return ResponseEntity.ok(new AuthController.SuccessResponse("HR signup request rejected successfully by Super Admin"));
        } catch (IllegalArgumentException e) {
            logger.warn("Failed to disapprove HR signup: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new AuthController.ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error disapproving HR signup: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new AuthController.ErrorResponse("An error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/superadmin/pending-signups")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserDTO>> getSuperAdminPendingSignups() {
        logger.info("Fetching pending signups for Super Admin");
        try {
            List<PendingSignup> pendingSignups = userService.getPendingHrSignups();

            List<UserDTO> userDTOs = pendingSignups.stream().map(pending -> {
                UserDTO dto = new UserDTO();
                dto.setId(pending.getId());
                dto.setFullName(pending.getFullName());
                dto.setUsername(pending.getUsername());
                dto.setEmail(pending.getEmail());
                dto.setDepartment(pending.getDepartment());
                dto.setRole(pending.getRole());
                dto.setGender(pending.getGender());
                dto.setJoinDate(pending.getJoinDate());
                dto.setEmployeeId(pending.getEmployeeId());
                dto.setStatus(pending.getStatus());
                dto.setDisapproveReason(pending.getReason());
                if (pending.getReportingTo() != null) {
                    dto.setReportingToId(pending.getReportingTo().getId());
                    dto.setReportingToName(pending.getReportingTo().getFullName());
                }
                return dto;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            logger.error("Error fetching pending signups for Super Admin: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }
}