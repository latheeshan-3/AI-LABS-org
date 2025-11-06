/*package com.example.java_backend.service;

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
}*/

package com.example.java_backend.service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.java_backend.dto.auth.AuthResponse;
import com.example.java_backend.dto.auth.LoginRequest;
import com.example.java_backend.dto.auth.RegisterRequest;
import com.example.java_backend.model.User;
import com.example.java_backend.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.util.Utils;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtService jwtService;
    @Autowired private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${app.base-url}")
    private String appBaseUrl;

    @Value("${google.client-id}")
    private String googleClientId;

    // -------------------------------
    // Email/password registration
    // -------------------------------
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("USER");
        user.setVerified(false); // Not verified yet

        // Generate unique verification token
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);

        userRepository.save(user);

        // Send verification email
        String verificationLink = appBaseUrl + "/api/auth/verify?token=" + token;
        String message = "Hi " + user.getFullName() + ",\n\nPlease verify your email using this link:\n" 
            + verificationLink + "\n\nThank you!";
        emailService.sendEmail(user.getEmail(), "Verify your account", message);

        return new AuthResponse(null, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    // -------------------------------
    // Google OAuth Login
    // -------------------------------
    public AuthResponse googleLogin(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    Utils.getDefaultTransport(),
                    Utils.getDefaultJsonFactory()
            )
            .setAudience(Collections.singletonList(googleClientId))
            .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                throw new RuntimeException("Invalid ID token.");
            }

            Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            // Check if user already exists
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                user = new User();
                user.setFullName(name);
                user.setEmail(email);
                user.setVerified(true); // Google already verified email
                user.setRole("USER");
                userRepository.save(user);
            }

            String token = jwtService.generateToken(user.getEmail());
            return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());

        } catch (GeneralSecurityException | IOException e) {
            throw new RuntimeException("Google token verification failed: " + e.getMessage());
        }
    }

    // -------------------------------
    // Email/password login
    // -------------------------------
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    // -------------------------------
    // Email verification
    // -------------------------------
    public String verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification link."));

        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return "Email verified successfully.";
    }

    // -------------------------------
    // Default admin setup
    // -------------------------------
    public void createDefaultAdmin() {
        if (!userRepository.existsByEmail("admin@email.com")) {
            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@email.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setVerified(true);
            userRepository.save(admin);
        }
    }
}


/*package com.example.java_backend.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
    @Autowired private EmailService emailService; // ✅ new service for sending emails

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

     // ✅ Inject from environment/application.properties
    @Value("${app.base-url}")
    private String appBaseUrl;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("USER");
        user.setVerified(false); // ✅ not verified yet

        // Generate unique verification token
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);

        userRepository.save(user);

         // ✅ Use injected base URL
        String verificationLink = appBaseUrl + "/api/auth/verify?token=" + token;
        String message = "Hi " + user.getFullName() + ",\n\nPlease verify your email using this link:\n" + verificationLink + "\n\nThank you!";
        emailService.sendEmail(user.getEmail(), "Verify your account", message);

        return new AuthResponse(null, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
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

    // ✅ Verify token from email
    public String verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification link."));

        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return "Email verified successfully.";
    }

    // ✅ Create default admin
    public void createDefaultAdmin() {
        if (!userRepository.existsByEmail("admin@email.com")) {
            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@email.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setVerified(true); // ✅ already verified
            userRepository.save(admin);
        }
    }
}
*/