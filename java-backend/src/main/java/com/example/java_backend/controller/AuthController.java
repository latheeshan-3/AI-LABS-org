package com.example.java_backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.java_backend.dto.auth.AuthResponse;
import com.example.java_backend.dto.auth.LoginRequest;
import com.example.java_backend.dto.auth.RegisterRequest;
import com.example.java_backend.service.AuthService;


@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = {"http://localhost:8080" ,"http://10.57.131.221:8080"}) // Vite frontend

public class AuthController {

    @Autowired private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/google")
public AuthResponse googleLogin(@RequestBody Map<String, String> request) {
    String idToken = request.get("token");
    return authService.googleLogin(idToken);
}


    @GetMapping("/verify")
public String verifyEmail(@RequestParam("token") String token) {
    return authService.verifyEmail(token);
}

}
