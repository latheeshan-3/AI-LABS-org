package com.example.java_backend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String password;

    // New fields
    private String hometown;
    private String contactNumber;
    private String status; // current status
    private String nic;
    private String sex;
    private LocalDate dateOfBirth;

     // ✅ Role: USER or ADMIN
    private String role = "USER"; 

    private String accountStatus = "ACTIVE"; // values: "ACTIVE", "SUSPENDED"

    // Student ID will map to the same as `id` (you can handle it in DTO or frontend)
}
