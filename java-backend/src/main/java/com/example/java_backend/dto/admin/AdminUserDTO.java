package com.example.java_backend.dto.admin;

import java.util.List;

import com.example.java_backend.model.UserSelectedCourse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor   // ✅ add this for flexibility
public class AdminUserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String contactNumber;
    private String hometown;
    private String status;
    private String accountStatus;
    private String studentId;
    private String batchId;  // ACTIVE / SUSPENDED

    private List<UserSelectedCourse> enrolledCourses;
}
