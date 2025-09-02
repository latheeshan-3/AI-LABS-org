package com.example.java_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.java_backend.dto.admin.AdminUserDTO;
import com.example.java_backend.repository.UserRepository;
import com.example.java_backend.repository.UserSelectedCourseRepository;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final UserSelectedCourseRepository userSelectedCourseRepository;

    public AdminUserService(UserRepository userRepository, UserSelectedCourseRepository userSelectedCourseRepository) {
        this.userRepository = userRepository;
        this.userSelectedCourseRepository = userSelectedCourseRepository;
    }

    public List<AdminUserDTO> getAllUsersWithCourses() {
        return userRepository.findAll().stream()
                .map(user -> new AdminUserDTO(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getContactNumber(),
                        user.getHometown(),
                        user.getStatus(),
                        user.getAccountStatus(),
                        user.getStudentId(),
                        user.getBatchId(),
                        userSelectedCourseRepository.findByUser(user)
                ))
                .collect(Collectors.toList());
    }

    @Transactional
public AdminUserDTO updateAccountStatus(Long userId, String accountStatus) {
    return userRepository.findById(userId)
            .map(user -> {
                user.setAccountStatus(accountStatus);
                userRepository.save(user);
                return new AdminUserDTO(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getContactNumber(),
                        user.getHometown(),
                        user.getStatus(),
                        user.getAccountStatus(), 
                        user.getStudentId(),
                        user.getBatchId(),
                          // ✅ include new field
                        userSelectedCourseRepository.findByUser(user)
                );
            })
            .orElseThrow(() -> new RuntimeException("User not found"));
}

}  