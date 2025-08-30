package com.example.java_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.java_backend.dto.course.UserSelectedCourseRequest;
import com.example.java_backend.model.UserSelectedCourse;
import com.example.java_backend.service.UserSelectedCourseService;

@RestController
@RequestMapping("/api/user-selected-courses")
@CrossOrigin(origins = "*")
public class UserSelectedCourseController {

    private final UserSelectedCourseService userSelectedCourseService;

    public UserSelectedCourseController(UserSelectedCourseService userSelectedCourseService) {
        this.userSelectedCourseService = userSelectedCourseService;
    }

   @PostMapping("/book")
public ResponseEntity<?> bookCourse(@RequestBody UserSelectedCourseRequest request) {
    try {
        UserSelectedCourse saved = userSelectedCourseService.bookCourse(request);
        return ResponseEntity.ok(saved);
    } catch (RuntimeException e) {
        return ResponseEntity
                .badRequest()
                .body(new ErrorResponse(e.getMessage()));
    }
}

// Add a simple error response DTO
static class ErrorResponse {
    private final String  message;

    public ErrorResponse(String message) { this.message = message; }
    public String getMessage() { return message; }
}

}
