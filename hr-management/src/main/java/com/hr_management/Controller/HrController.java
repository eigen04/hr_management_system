package com.hr_management.Controller;

import com.hr_management.dto.ProfileReviewDTO;
import com.hr_management.dto.UserProfileDetailDTO;
import com.hr_management.service.ProfileService;
import com.hr_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hr")
public class HrController {

    @Autowired
    private ProfileService profileService;
    @Autowired
    private UserService userService;

    @GetMapping("/user") // Adjust method and path as needed
    public ResponseEntity<?> getUser() {
        // Your logic here
        return ResponseEntity.ok("User data");
    }

    @GetMapping("/profiles/verification")
    public ResponseEntity<List<ProfileReviewDTO>> getProfilesForVerification() {
        return ResponseEntity.ok(profileService.getProfilesForVerification());
    }

    @GetMapping("/profiles/{userId}")
    public ResponseEntity<UserProfileDetailDTO> getProfileDetails(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(profileService.getProfileDetailsForHr(userId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/profiles/{userId}/approve")
    public ResponseEntity<?> approveProfile(@PathVariable Long userId) {
        try {
            profileService.approveProfile(userId);
            return ResponseEntity.ok(Map.of("message", "Profile approved successfully."));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // --- MODIFIED METHOD ---
    // The method signature is changed to accept a @RequestBody.
    // The call to the service now includes the reason.
    @PostMapping("/profiles/{userId}/reject")
    public ResponseEntity<?> rejectProfile(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        try {
            String reason = payload.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Rejection reason is required."));
            }

            // Pass the reason to the service layer
            profileService.rejectProfile(userId, reason);

            return ResponseEntity.ok(Map.of("message", "Profile rejected successfully. Documents have been deleted."));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping("/change-reporting-person/{userId}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<?> changeReportingPerson(@PathVariable Long userId, @RequestBody Map<String, Long> payload) {
        try {
            Long newReportingToId = payload.get("newReportingToId");
            if (newReportingToId == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "newReportingToId is required."));
            }

            userService.changeReportingPerson(userId, newReportingToId);

            return ResponseEntity.ok(Map.of("message", "Reporting person updated successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An unexpected error occurred."));
        }
    }
    @GetMapping("/edit-requests")
    public ResponseEntity<List<ProfileReviewDTO>> getEditRequests() {
        // --- CHANGE HERE: Call the correct service method ---
        return ResponseEntity.ok(profileService.getProfileUpdateRequests());
    }

    @PostMapping("/profiles/{userId}/allow-edit")
    public ResponseEntity<?> allowEdit(@PathVariable Long userId) {
        try {
            // --- CHANGE HERE: Call the correct service method ---
            profileService.allowProfileUpdate(userId);
            return ResponseEntity.ok(Map.of("message", "Profile unlocked for edits. User has been notified."));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}