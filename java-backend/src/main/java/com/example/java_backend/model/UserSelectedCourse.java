package com.example.java_backend.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "user_selected_courses")
public class UserSelectedCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Relation to User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ✅ Relation to Course
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    // 🔹 Store course title at the time of enrollment (in case course title changes later)
    private String selectedCourseTitle;

    // 🔹 Extra details
    private String completionStatus;   // e.g., "Enrolled", "In Progress", "Completed"
    private String certificateUrl;     // link to certificate (if completed)
    private LocalDate enrolledDate;    // when the user enrolled
}
