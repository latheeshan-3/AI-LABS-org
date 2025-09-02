package com.example.java_backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.java_backend.dto.admin.AnnouncementCreateRequest;
import com.example.java_backend.dto.admin.AnnouncementDTO;
import com.example.java_backend.mapper.AnnouncementMapper;
import com.example.java_backend.model.Announcement;
import com.example.java_backend.model.AnnouncementRecipient;
import com.example.java_backend.model.User;
import com.example.java_backend.repository.AnnouncementRecipientRepository;
import com.example.java_backend.repository.AnnouncementRepository;
import com.example.java_backend.repository.UserRepository;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementRecipientRepository recipientRepository;
    private final UserRepository userRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               AnnouncementRecipientRepository recipientRepository,
                               UserRepository userRepository) {
        this.announcementRepository = announcementRepository;
        this.recipientRepository = recipientRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AnnouncementDTO create(AnnouncementCreateRequest req) {
        // Resolve creator (simple: via id passed in request)
        User creator = null;
        if (req.getCreatedBy() != null) {
            creator = userRepository.findById(req.getCreatedBy())
                    .orElse(null);
        }

        Announcement.TargetType targetType;
        try {
            targetType = Announcement.TargetType.valueOf(req.getTarget());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid target: " + req.getTarget());
        }

        Announcement a = new Announcement();
        a.setTitle(req.getTitle());
        a.setMessage(req.getMessage());
        a.setCreatedAt(LocalDateTime.now());
        a.setCreatedBy(creator);
        a.setTargetType(targetType);
        if (targetType == Announcement.TargetType.BATCH) {
            a.setBatchId(req.getBatchId());
        }

        // Save the announcement first
        a = announcementRepository.save(a);

        // Resolve recipients
        List<User> recipients = switch (targetType) {
            case ALL -> userRepository.findAll();
            case USERS -> {
                if (req.getUserIds() == null || req.getUserIds().isEmpty()) {
                    throw new IllegalArgumentException("userIds required when target=USERS");
                }
                yield userRepository.findAllById(req.getUserIds());
            }
            case BATCH -> {
                if (req.getBatchId() == null || req.getBatchId().isBlank()) {
                    throw new IllegalArgumentException("batchId required when target=BATCH");
                }
                yield userRepository.findByBatchId(req.getBatchId());
            }
        };

        if (recipients.isEmpty()) {
            throw new IllegalStateException("No recipients resolved for this announcement");
        }

        // Insert recipient rows
        List<AnnouncementRecipient> rows = new ArrayList<>();
        for (User u : recipients) {
            AnnouncementRecipient r = new AnnouncementRecipient();
            r.setAnnouncement(a);
            r.setUser(u);
            rows.add(r);
        }
        recipientRepository.saveAll(rows);

        return AnnouncementMapper.toDTO(a, rows.size());
    }

    @Transactional(readOnly = true)
    public List<AnnouncementDTO> listAll() {
        List<Announcement> list = announcementRepository.findAll();
        List<AnnouncementDTO> dtos = new ArrayList<>(list.size());
        for (Announcement a : list) {
            int count = recipientRepository.findByAnnouncement(a).size();
            dtos.add(AnnouncementMapper.toDTO(a, count));
        }
        return dtos;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listRecipients(Long announcementId) {
        Announcement a = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new NoSuchElementException("Announcement not found: " + announcementId));

        List<AnnouncementRecipient> recipients = recipientRepository.findByAnnouncement(a);

        List<Map<String, Object>> out = new ArrayList<>();
        for (AnnouncementRecipient r : recipients) {
            Map<String, Object> row = new HashMap<>();
            row.put("userId", r.getUser().getId());
            row.put("fullName", r.getUser().getFullName());
            row.put("email", r.getUser().getEmail());
            row.put("batchId", r.getUser().getBatchId());
            row.put("status", r.getStatus().name()); // UNREAD/READ (read later)
            out.add(row);
        }
        return out;
    }

	@Transactional(readOnly = true)
public List<AnnouncementDTO> getAnnouncementsForUser(Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found: " + userId));

    // fetch all rows from AnnouncementRecipient for this user
    List<AnnouncementRecipient> recips = recipientRepository.findByUser(user);

    List<AnnouncementDTO> out = new ArrayList<>();
    for (AnnouncementRecipient r : recips) {
        Announcement a = r.getAnnouncement();
        int totalRecipients = recipientRepository.findByAnnouncement(a).size();
        out.add(AnnouncementMapper.toDTO(a, totalRecipients));
    }

    // optionally sort newest first
    out.sort((a1, a2) -> a2.getCreatedAt().compareTo(a1.getCreatedAt()));

    return out;
}


    @Transactional
    public void delete(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with id " + id));

        // ✅ Because we set cascade + orphanRemoval, recipients will be deleted automatically.
        announcementRepository.delete(announcement);
    }


}
