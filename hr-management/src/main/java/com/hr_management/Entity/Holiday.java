package com.hr_management.Entity;



import jakarta.persistence.*;

import java.time.LocalDate;

import java.time.LocalDateTime;



@Entity

@Table(name = "holidays")

public class Holiday {



    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;



    @Column(nullable = false)

    private String name;



    @Column(nullable = false, unique = true)

    private LocalDate date;



    @Column(nullable = false)

    private String type; // CUSTOM, SUNDAY, SATURDAY_2_4



    @Column(name = "created_at")

    private LocalDateTime createdAt;



    public Holiday() {}



    public Holiday(String name, LocalDate date, String type) {

        this.name = name;

        this.date = date;

        this.type = type;

        this.createdAt = LocalDateTime.now();

    }



    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public LocalDate getDate() { return date; }

    public void setDate(LocalDate date) { this.date = date; }

    public String getType() { return type; }

    public void setType(String type) { this.type = type; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

}