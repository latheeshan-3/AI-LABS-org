package com.example.java_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.java_backend.dto.admin.AdminUserDTO;
import com.example.java_backend.service.AdminUserService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllUsersWithCourses() {
        return ResponseEntity.ok(adminUserService.getAllUsersWithCourses());
    }

    @PutMapping("/users/{id}/status")
public ResponseEntity<?> updateUserStatus(
        @PathVariable Long id,
        @RequestParam String accountStatus) {

    return ResponseEntity.ok(adminUserService.updateAccountStatus(id, accountStatus));
}

}  