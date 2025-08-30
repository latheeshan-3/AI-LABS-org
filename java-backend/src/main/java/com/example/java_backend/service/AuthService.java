package com.example.java_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.java_backend.dto.auth.AuthResponse;
import com.example.java_backend.dto.auth.LoginRequest;
import com.example.java_backend.dto.auth.RegisterRequest;
import com.example.java_backend.model.User;
import com.example.java_backend.repository.UserRepository;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("USER"); // ✅ new users are USER by default

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    // ✅ Preload an Admin account if not exists
    public void createDefaultAdmin() {
        if (!userRepository.existsByEmail("admin@email.com")) {
            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@email.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN"); // ✅ admin role
            userRepository.save(admin);
        }
    }
}