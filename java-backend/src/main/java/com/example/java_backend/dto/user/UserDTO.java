package com.example.java_backend.dto.user;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String hometown;
    private String contactNumber;
    private String status;
    private String nic;
    private String sex;
    private LocalDate dateOfBirth;
    private String accountStatus;
    private String studentId;
    private String batchId;
    private boolean isVerified; 

   
}
