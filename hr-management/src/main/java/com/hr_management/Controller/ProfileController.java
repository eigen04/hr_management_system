package com.hr_management.Controller;

import com.hr_management.dto.ProfileDTO;
import com.hr_management.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PostMapping(value = "/profile", consumes = {"multipart/form-data"})
    public ResponseEntity<?> submitProfile(Authentication authentication,
                                           @RequestParam Map<String, String> textParts,
                                           @RequestParam Map<String, MultipartFile> fileParts) {
        try {
            String username = authentication.getName();

            ProfileDTO profileDTO = new ProfileDTO();
            profileDTO.setDob(textParts.get("dob"));
            profileDTO.setFatherName(textParts.get("fatherName"));
            profileDTO.setMotherName(textParts.get("motherName"));
            profileDTO.setEmergencyContactNumber(textParts.get("emergencyContactNumber"));
            profileDTO.setIsFresher(Boolean.parseBoolean(textParts.get("isFresher")));

            profileService.submitProfile(username, profileDTO, textParts, fileParts);

            return ResponseEntity.ok(Map.of("message", "Profile submitted successfully for HR verification."));

        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    // --- CHANGE HERE: Correct the PostMapping path ---
    @PostMapping("/request-edit")
    public ResponseEntity<?> requestProfileUpdate(Authentication authentication) {
        try {
            String username = authentication.getName();
            // The service method name is okay, we will fix the logic inside it
            profileService.requestProfileUpdate(username);
            return ResponseEntity.ok(Map.of("message", "Profile update request submitted successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}