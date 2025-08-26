package com.hr_management.Entity;



import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

import java.time.LocalDate;



@Entity

@Table(name = "leave_applications")

public class LeaveApplication {



    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;



    @ManyToOne

    @JoinColumn(name = "user_id")

    @JsonBackReference // Prevent serialization of user to avoid recursion

    private User user;



    private String leaveType;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;

    private boolean isHalfDay;

    private String status;

    private LocalDate appliedOn;

    private double remainingLeaves;



    @Column(name = "approver_id", nullable = true)

    private Long approverId;



// Getters and Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public String getLeaveType() { return leaveType; }

    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }

    public LocalDate getStartDate() { return startDate; }

    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }

    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getReason() { return reason; }

    public void setReason(String reason) { this.reason = reason; }

    public boolean isHalfDay() { return isHalfDay; }

    public void setHalfDay(boolean halfDay) { isHalfDay = halfDay; }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    public LocalDate getAppliedOn() { return appliedOn; }

    public void setAppliedOn(LocalDate appliedOn) { this.appliedOn = appliedOn; }

    public double getRemainingLeaves() { return remainingLeaves; }

    public void setRemainingLeaves(double remainingLeaves) { this.remainingLeaves = remainingLeaves; }

    public Long getApproverId() { return approverId; }

    public void setApproverId(Long approverId) { this.approverId = approverId; }

}