package com.hr_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime; // ++ IMPORT THIS

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private String documentType;
    private String customDocumentName;
    private String fileName;
    private boolean isPreviousCompany;
}