package com.example.java_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.java_backend.dto.admin.AnnouncementDTO;
import com.example.java_backend.service.AnnouncementService;



@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class UserAnnouncementController {

    private final AnnouncementService announcementService;

    public UserAnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    // Fetch announcements for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AnnouncementDTO>> getForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(announcementService.getAnnouncementsForUser(userId));
    }
}
