package com.hr_management.dto;



import jakarta.validation.constraints.Email;

import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

import java.util.List; // <-- Make sure this import is present



public class UserDTO {

// --- All your existing fields are fine ---

    private Long id;

    private String fullName;

    private String username;

    private String password;

    private String email;

    private String department;

    private String role;

    private String gender;

    private Long reportingToId;

    private String reportingToName;

    private String status;

    private String disapproveReason;

    private LocalDate joinDate;

    private String employeeId;

    private String profileVerificationStatus;



// --- ADD THESE NEW FIELDS ---

    private LocalDate dob;

    private String fatherName;

    private String motherName;

    private String emergencyContactNumber;

    private Boolean isFresher;

    private List<DocumentDTO> documents; // This will hold all uploaded documents



// --- All your existing getters and setters are fine ---

    public UserDTO() {}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }

    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }

    public void setDepartment(String department) { this.department = department; }

    public String getRole() { return role; }

    public void setRole(String role) { this.role = role; }

    public String getGender() { return gender; }

    public void setGender(String gender) { this.gender = gender; }

    public Long getReportingToId() { return reportingToId; }

    public void setReportingToId(Long reportingToId) { this.reportingToId = reportingToId; }

    public String getReportingToName() { return reportingToName; }

    public void setReportingToName(String reportingToName) { this.reportingToName = reportingToName; }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    public String getDisapproveReason() { return disapproveReason; }

    public void setDisapproveReason(String disapproveReason) { this.disapproveReason = disapproveReason; }

    public LocalDate getJoinDate() { return joinDate; }

    public void setJoinDate(LocalDate joinDate) { this.joinDate = joinDate; }

    public String getEmployeeId() { return employeeId; }

    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getProfileVerificationStatus() { return profileVerificationStatus; }

    public void setProfileVerificationStatus(String profileVerificationStatus) { this.profileVerificationStatus = profileVerificationStatus; }



// --- ADD GETTERS AND SETTERS FOR THE NEW FIELDS ---

    public LocalDate getDob() { return dob; }

    public void setDob(LocalDate dob) { this.dob = dob; }

    public String getFatherName() { return fatherName; }

    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getMotherName() { return motherName; }

    public void setMotherName(String motherName) { this.motherName = motherName; }

    public String getEmergencyContactNumber() { return emergencyContactNumber; }

    public void setEmergencyContactNumber(String emergencyContactNumber) { this.emergencyContactNumber = emergencyContactNumber; }

    public Boolean getIsFresher() { return isFresher; }

    public void setIsFresher(Boolean isFresher) { this.isFresher = isFresher; }

    public List<DocumentDTO> getDocuments() { return documents; }

    public void setDocuments(List<DocumentDTO> documents) { this.documents = documents; }

}