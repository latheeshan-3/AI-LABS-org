package com.example.java_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.java_backend.model.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
