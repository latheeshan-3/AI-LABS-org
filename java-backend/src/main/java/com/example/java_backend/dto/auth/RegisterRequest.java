package com.example.java_backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
}
