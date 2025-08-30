package com.example.java_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String image;
    private String mode;  // Online / Physical / Both
    private double rating;
    private int reviews;
    private String price;
    private String level; // Beginner / Intermediate / Advanced

    // 🔹 New Fields
    private int totalParticipants;       // total number of enrolled participants
    private String certificateProviders; // e.g., "MIT, Harvard"
    private String promoCode;            // optional promo code
    private String demoCertificate;      // URL to demo certificate (image/pdf)
}
