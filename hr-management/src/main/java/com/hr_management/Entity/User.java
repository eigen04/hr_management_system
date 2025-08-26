package com.hr_management.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String fullName;
    @Column(nullable = false, unique = true)
    private String username;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false, unique = true)
    private String email;
    @Column
    private String department;
    @Column(name = "join_date", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate joinDate = LocalDate.now();
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")

    private Department departmentEntity;



    @Column(nullable = false)

    private String role;
    @Column

    private String gender;
    @Embedded

    private LeaveBalance leaveBalance = new LeaveBalance();



    @Column(nullable = false)

    private String status = "PENDING";

    @Column(name = "disapprove_reason")

    private String disapproveReason;
    @Column(name = "leave_without_payment", nullable = false)

    private Double leaveWithoutPayment = 0.0;
    @Column(name = "half_day_lwp", nullable = false)

    private Double halfDayLwp = 0.0;

    @ManyToOne

    @JoinColumn(name = "reporting_to")

    @JsonBackReference

    private User reportingTo;



    @OneToMany(mappedBy = "reportingTo")

    @JsonManagedReference

    private List<User> subordinates;



    @Column(name = "employee_id", nullable = false, unique = true)

    private String employeeId;



    @Column(name = "dob")

    private LocalDate dob;



    @Column(name = "father_name")

    private String fatherName;



    @Column(name = "mother_name")

    private String motherName;



    @Column(name = "emergency_contact_number")

    private String emergencyContactNumber;



    @Column(name = "is_fresher", nullable = false)

    private Boolean isFresher = true;



    @Column(name = "profile_verification_status", nullable = false)

    private String profileVerificationStatus = "PENDING";


// Custom getter and setter for department to handle departmentEntity

    public String getDepartment() {

        return departmentEntity != null ? departmentEntity.getName() : department;

    }



    public void setDepartment(String department) {

        this.department = department;

    }



    public Department getDepartmentEntity() {

        return departmentEntity;

    }



    public void setDepartmentEntity(Department departmentEntity) {

        this.departmentEntity = departmentEntity;

        this.department = departmentEntity != null ? departmentEntity.getName() : null;

    }

}