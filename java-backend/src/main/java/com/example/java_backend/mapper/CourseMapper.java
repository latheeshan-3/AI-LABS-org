package com.example.java_backend.mapper;

import com.example.java_backend.dto.course.CourseDTO;
import com.example.java_backend.model.Course;

public class CourseMapper {
    public static CourseDTO toDTO(Course course) {
        return new CourseDTO(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getImage(),
                course.getMode(),
                course.getRating(),
                course.getReviews(),
                course.getPrice(),
                course.getLevel(),
                course.getTotalParticipants(),
                course.getCertificateProviders(),
                course.getPromoCode(),
                course.getDemoCertificate()
        );
    }

    //  New method: converts CourseDTO -> Course
    public static Course toEntity(CourseDTO dto) {
        Course course = new Course();
        course.setId(dto.getId()); // optional, usually null for new course
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setImage(dto.getImage());
        course.setMode(dto.getMode());
        course.setRating(dto.getRating());
        course.setReviews(dto.getReviews());
        course.setPrice(dto.getPrice());
        course.setLevel(dto.getLevel());
        course.setTotalParticipants(dto.getTotalParticipants());
        course.setCertificateProviders(dto.getCertificateProviders());
        course.setPromoCode(dto.getPromoCode());
        course.setDemoCertificate(dto.getDemoCertificate());
        return course;
    }
}
