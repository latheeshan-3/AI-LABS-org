package com.example.java_backend.dto.course;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private String image;
    private String mode;
    private double rating;
    private int reviews;
    private String price;
    private String level;

    // 🔹 New Fields
    private int totalParticipants;
    private String certificateProviders;
    private String promoCode;
    private String demoCertificate;
}
