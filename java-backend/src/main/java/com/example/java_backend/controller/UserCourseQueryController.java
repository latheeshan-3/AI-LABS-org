package com.example.java_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.java_backend.model.UserSelectedCourse;
import com.example.java_backend.service.UserCourseQueryService;

@RestController
@RequestMapping("/api/user-courses")
@CrossOrigin(origins = "*")
public class UserCourseQueryController {

    private final UserCourseQueryService userCourseQueryService;

    public UserCourseQueryController(UserCourseQueryService userCourseQueryService) {
        this.userCourseQueryService = userCourseQueryService;
    }

    // ✅ Get all courses enrolled by a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<UserSelectedCourse>> getUserCourses(@PathVariable Long userId) {
        List<UserSelectedCourse> courses = userCourseQueryService.getUserCourses(userId);
        return ResponseEntity.ok(courses);
    }
}
