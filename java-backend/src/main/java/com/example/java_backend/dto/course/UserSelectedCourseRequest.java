package com.example.java_backend.dto.course;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSelectedCourseRequest {
    private Long userId;
    private Long courseId;
    private String completionStatus;   // ENROLLED / IN_PROGRESS / COMPLETED
    private String selectedCourseTitle;
    private String certificateUrl;
    private LocalDate enrolledDate;
}
