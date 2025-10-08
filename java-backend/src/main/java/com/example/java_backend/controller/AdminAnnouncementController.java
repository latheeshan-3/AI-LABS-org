package com.example.java_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.java_backend.dto.admin.AnnouncementCreateRequest;
import com.example.java_backend.dto.admin.AnnouncementDTO;
import com.example.java_backend.service.AnnouncementService;

@RestController
@RequestMapping("/api/admin/announcements")
//@CrossOrigin(origins = "*")
public class AdminAnnouncementController {

    private final AnnouncementService announcementService;

    public AdminAnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    // Create announcement (target: ALL | USERS | BATCH)
    @PostMapping
    public ResponseEntity<AnnouncementDTO> create(@RequestBody AnnouncementCreateRequest req) {
        return ResponseEntity.ok(announcementService.create(req));
    }

    // List all announcements (admin view)
    @GetMapping
    public ResponseEntity<List<AnnouncementDTO>> listAll() {
        return ResponseEntity.ok(announcementService.listAll());
    }

    // Inspect recipients for a specific announcement (admin view)
    @GetMapping("/{id}/recipients")
    public ResponseEntity<List<Map<String, Object>>> recipients(@PathVariable Long id) {
        return ResponseEntity.ok(announcementService.listRecipients(id));
    }

    // ✅ Delete announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        announcementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
