package com.example.java_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.java_backend.model.User;
import com.example.java_backend.model.UserSelectedCourse;
import com.example.java_backend.repository.UserRepository;
import com.example.java_backend.repository.UserSelectedCourseRepository;

@Service
public class UserCourseQueryService {

    private final UserSelectedCourseRepository userSelectedCourseRepository;
    private final UserRepository userRepository;

    public UserCourseQueryService(UserSelectedCourseRepository repo, UserRepository userRepository) {
        this.userSelectedCourseRepository = repo;
        this.userRepository = userRepository;
    }

    public List<UserSelectedCourse> getUserCourses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userSelectedCourseRepository.findByUser(user);
    }
}
