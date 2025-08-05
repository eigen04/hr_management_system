package com.hr_management.service;

import com.hr_management.Entity.Document;
import com.hr_management.Entity.User;
import com.hr_management.Repository.DocumentRepository;
import com.hr_management.Repository.UserRepository;
import com.hr_management.dto.DocumentDTO;
import com.hr_management.dto.ProfileDTO;
import com.hr_management.dto.ProfileReviewDTO;
import com.hr_management.dto.UserProfileDetailDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    // --- CHANGE 1: INJECT THE EMAILSERVICE INSTANCE ---
    @Autowired
    private EmailService emailService;

    private final Path rootLocation = Paths.get("uploads");

    private final List<String> documentTypes = Arrays.asList(
            "aadhaar", "pan", "marksheets", "offer_letter", "joining_form",
            "isa_form", "affidavit", "police_verification", "passbook_copy"
    );

    private final List<String> previousCompanyDocumentTypes = Arrays.asList(
            "experience_letter", "payslips", "relieving_letter"
    );

    public ProfileService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    // ... (No changes needed for submitProfile, saveFileAndCreateDocument, getProfilesForVerification, getProfileDetailsForHr, approveProfile) ...
    @Transactional
    public void submitProfile(String username, ProfileDTO profileDTO, Map<String, String> textParts, Map<String, MultipartFile> fileParts) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));

        if (!Arrays.asList("PENDING", "EDIT_ALLOWED").contains(user.getProfileVerificationStatus())) {
            throw new IllegalStateException("Profile cannot be submitted in its current state: " + user.getProfileVerificationStatus());
        }
        if ("EDIT_ALLOWED".equals(user.getProfileVerificationStatus())) {
            List<Document> oldDocs = documentRepository.findByUserId(user.getId());
            for (Document doc : oldDocs) {
                try {
                    Files.deleteIfExists(Paths.get(doc.getFilePath()));
                } catch (IOException e) {
                    System.err.println("Could not delete old file: " + doc.getFilePath());
                }
            }
            documentRepository.deleteAll(oldDocs);
        }

        user.setDob(LocalDate.parse(profileDTO.getDob()));
        user.setFatherName(profileDTO.getFatherName());
        user.setMotherName(profileDTO.getMotherName());
        user.setEmergencyContactNumber(profileDTO.getEmergencyContactNumber());
        user.setIsFresher(profileDTO.getIsFresher());
        user.setProfileVerificationStatus("SUBMITTED");

        saveFileAndCreateDocument(user, fileParts.get("photo"), "photo", false, null);

        for (String docType : documentTypes) {
            if (fileParts.containsKey(docType)) {
                saveFileAndCreateDocument(user, fileParts.get(docType), docType, false, null);
            }
        }

        if (!profileDTO.getIsFresher()) {
            for (String docType : previousCompanyDocumentTypes) {
                if (fileParts.containsKey(docType)) {
                    saveFileAndCreateDocument(user, fileParts.get(docType), docType, true, null);
                }
            }
        }

        for (Map.Entry<String, String> entry : textParts.entrySet()) {
            if (entry.getKey().startsWith("additionalDocument") && entry.getKey().endsWith("_name")) {
                String customDocName = entry.getValue();
                String fileKey = entry.getKey().replace("_name", "_file");
                MultipartFile file = fileParts.get(fileKey);
                if (file != null && !file.isEmpty() && customDocName != null && !customDocName.isEmpty()) {
                    saveFileAndCreateDocument(user, file, "additional_document", false, customDocName);
                }
            }
        }

        userRepository.save(user);
    }

    private void saveFileAndCreateDocument(User user, MultipartFile file, String docType, boolean isPreviousCompany, String customDocName) {
        if (file == null || file.isEmpty()) {
            return;
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String filename = user.getUsername() + "_" + docType + "_" + System.currentTimeMillis() + "_" + originalFilename;

        try {
            Path destinationFile = this.rootLocation.resolve(filename).normalize().toAbsolutePath();
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            Document document = new Document();
            document.setUser(user);
            document.setDocumentType(docType);
            document.setFilePath(destinationFile.toString());
            document.setIsPreviousCompany(isPreviousCompany);

            if (customDocName != null && !customDocName.isEmpty()) {
                document.setCustomDocumentName(customDocName);
            }

            documentRepository.save(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }
    }

    @Transactional(readOnly = true)
    public List<ProfileReviewDTO> getProfilesForVerification() {
        List<String> statuses = Arrays.asList("SUBMITTED", "VERIFIED", "REJECTED");
        return userRepository.findByProfileVerificationStatusIn(statuses)
                .stream()
                .map(user -> new ProfileReviewDTO(
                        user.getId(),
                        user.getEmployeeId(),
                        user.getFullName(),
                        user.getProfileVerificationStatus()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserProfileDetailDTO getProfileDetailsForHr(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Document> documents = documentRepository.findByUserId(userId);

        UserProfileDetailDTO dto = new UserProfileDetailDTO();
        dto.setUserId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setEmployeeId(user.getEmployeeId());
        dto.setDob(user.getDob());
        dto.setFatherName(user.getFatherName());
        dto.setMotherName(user.getMotherName());
        dto.setEmergencyContactNumber(user.getEmergencyContactNumber());
        dto.setIsFresher(user.getIsFresher());
        dto.setProfileVerificationStatus(user.getProfileVerificationStatus());

        dto.setDocuments(documents.stream().map(doc -> new DocumentDTO(
                doc.getDocumentType(),
                doc.getCustomDocumentName(),
                java.nio.file.Paths.get(doc.getFilePath()).getFileName().toString(),
                doc.getIsPreviousCompany()
        )).collect(Collectors.toList()));

        return dto;
    }

    @Transactional
    public void approveProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if (!"SUBMITTED".equals(user.getProfileVerificationStatus())) {
            throw new IllegalStateException("Profile can only be approved if the status is SUBMITTED.");
        }

        user.setProfileVerificationStatus("VERIFIED");
        userRepository.save(user);
    }

    @Transactional
    public void rejectProfile(Long userId, String reason) {
        // Find the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Check current status
        if (!"SUBMITTED".equals(user.getProfileVerificationStatus())) {
            throw new IllegalStateException("Profile can only be rejected if its status is SUBMITTED.");
        }

        // Find all documents associated with the user
        List<Document> documentsToDelete = documentRepository.findByUserId(userId);

        // Delete the physical files from server storage
        for (Document doc : documentsToDelete) {
            try {
                if (doc.getFilePath() != null && !doc.getFilePath().isEmpty()) {
                    Files.deleteIfExists(Paths.get(doc.getFilePath()));
                }
            } catch (IOException e) {
                System.err.println("Failed to delete physical file: " + doc.getFilePath());
                e.printStackTrace();
            }
        }

        // Delete the document records from the database
        if (!documentsToDelete.isEmpty()) {
            documentRepository.deleteAll(documentsToDelete);
        }

        // Update user's status to PENDING so they can resubmit
        user.setProfileVerificationStatus("PENDING");
        userRepository.save(user);

        // --- CHANGE 2: CALL THE METHOD ON THE INJECTED INSTANCE (emailService) ---
        emailService.sendProfileRejectionEmail(user.getEmail(), user.getFullName(), reason);
    }
    @Transactional
    public void requestProfileUpdate(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!"VERIFIED".equals(user.getProfileVerificationStatus())) {
            throw new IllegalStateException("You can only request an update for a VERIFIED profile.");
        }

        user.setProfileVerificationStatus("EDIT_REQUESTED");
        userRepository.save(user);

        // Optional: Notify HR via email that a request has been made.
    }
    @Transactional(readOnly = true)
    public List<ProfileReviewDTO> getProfileUpdateRequests() {
        // --- CHANGE HERE: Use the correct status name ---
        return userRepository.findByProfileVerificationStatus("EDIT_REQUESTED")
                .stream()
                .map(user -> new ProfileReviewDTO(
                        user.getId(),
                        user.getEmployeeId(),
                        user.getFullName(),
                        user.getProfileVerificationStatus()
                ))
                .collect(Collectors.toList());
    }
    @Transactional
    public void allowProfileUpdate(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!"EDIT_REQUESTED".equals(user.getProfileVerificationStatus())) {
            throw new IllegalStateException("User has not requested a profile update.");
        }

        user.setProfileVerificationStatus("EDIT_ALLOWED");
        userRepository.save(user);

        // Notify the employee that their form is unlocked
        emailService.sendProfileUpdateAllowedEmail(user.getEmail(), user.getFullName());
    }
}