package com.example.java_backend.mapper;

import com.example.java_backend.dto.admin.AnnouncementDTO;
import com.example.java_backend.model.Announcement;

public class AnnouncementMapper {

    public static AnnouncementDTO toDTO(Announcement a, int recipientCount) {
        AnnouncementDTO dto = new AnnouncementDTO();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setMessage(a.getMessage());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setCreatedById(a.getCreatedBy() != null ? a.getCreatedBy().getId() : null);
        dto.setCreatedByName(a.getCreatedBy() != null ? a.getCreatedBy().getFullName() : null);
        dto.setTargetType(a.getTargetType() != null ? a.getTargetType().name() : null);
        dto.setBatchId(a.getBatchId());
        dto.setRecipientCount(recipientCount);
        return dto;
    }
}
