package com.example.java_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    static class ErrorResponse {
        private final String message;
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }

    @DeleteMapping("/{userId}/{courseId}")
    public ResponseEntity<?> unenrollCourse(@PathVariable Long userId, @PathVariable Long courseId) {
        boolean success = userSelectedCourseService.unenrollCourse(userId, courseId);
        if (success) {
            return ResponseEntity.ok("Unenrolled successfully");
        } else {
            return ResponseEntity.status(404).body("Enrollment not found");
        }
    }

   @PostMapping("/{enrollmentId}/certificate-url")
public ResponseEntity<?> updateCertificateUrl(
        @PathVariable Long enrollmentId,
        @RequestParam("certificateUrl") String certificateUrl) {
    try {
        UserSelectedCourse updated = userSelectedCourseService.updateCertificateUrl(enrollmentId, certificateUrl);
        return ResponseEntity.ok(updated);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

}
