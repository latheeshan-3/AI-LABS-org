package com.example.java_backend.dto.user;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDTO {
    private String fullName;
    private String hometown;
    private String contactNumber;
    private String status;
    private String nic;
    private String sex;
    private LocalDate dateOfBirth;
}
