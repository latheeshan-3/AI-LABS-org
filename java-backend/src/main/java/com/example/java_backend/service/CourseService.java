package com.example.java_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.java_backend.dto.course.CourseDTO;
import com.example.java_backend.mapper.CourseMapper;
import com.example.java_backend.repository.CourseRepository;
import com.example.java_backend.model.Course;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(CourseMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 🔹 Create a new course
    public CourseDTO createCourse(CourseDTO dto) {
        Course course = CourseMapper.toEntity(dto);
        Course savedCourse = courseRepository.save(course);
        return CourseMapper.toDTO(savedCourse);
    }

    // 🔹 Update an existing course
    @Transactional
    public CourseDTO updateCourse(Long id, CourseDTO dto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id " + id));

        // Update fields
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

        return CourseMapper.toDTO(course);
    }

    // 🔹 Delete a course
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

}
