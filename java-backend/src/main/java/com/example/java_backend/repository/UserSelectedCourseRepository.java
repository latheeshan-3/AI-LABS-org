package com.example.java_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.java_backend.model.User;
import com.example.java_backend.model.UserSelectedCourse;

public interface UserSelectedCourseRepository extends JpaRepository<UserSelectedCourse, Long>
 {  Optional<UserSelectedCourse> findByUserIdAndCourseId(Long userId, Long courseId);
      List<UserSelectedCourse> findByUser(User user);
} 
