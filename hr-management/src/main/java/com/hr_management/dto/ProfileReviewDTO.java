package com.hr_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime; // ++ IMPORT THIS

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileReviewDTO {
    private Long userId;
    private String employeeId;
    private String fullName;
    private String profileVerificationStatus;
}