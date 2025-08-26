package com.hr_management.Entity;



import java.time.LocalDate;



public class LeaveApplicationDTO {

    private Long id;

    private String userName;

    private String leaveType;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;

    private String status;

    private LocalDate appliedOn;

    private double remainingLeaves; // Changed from int to double

    private boolean isHalfDay;

    private String department;



// Getters and Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getUserName() { return userName; }

    public void setUserName(String userName) { this.userName = userName; }

    public String getLeaveType() { return leaveType; }

    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }

    public LocalDate getStartDate() { return startDate; }

    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }

    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getReason() { return reason; }

    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    public LocalDate getAppliedOn() { return appliedOn; }

    public void setAppliedOn(LocalDate appliedOn) { this.appliedOn = appliedOn; }

    public double getRemainingLeaves() { return remainingLeaves; } // Changed to double

    public void setRemainingLeaves(double remainingLeaves) { this.remainingLeaves = remainingLeaves; } // Changed to double

    public boolean isHalfDay() { return isHalfDay; }

    public void setHalfDay(boolean halfDay) { this.isHalfDay = halfDay; }

    public String getDepartment() { return department; }

    public void setDepartment(String department) { this.department = department; }

}