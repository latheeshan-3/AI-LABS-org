package com.example.java_backend.dto.admin;

import java.util.List;

public class AnnouncementCreateRequest {
    private String title;
    private String message;

    // "ALL" | "USERS" | "BATCH"
    private String target;

    // only for target == USERS
    private List<Long> userIds;

    // only for target == BATCH
    private String batchId;

    private Long createdBy; // admin user id (or resolve from auth)

    // getters & setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public List<Long> getUserIds() { return userIds; }
    public void setUserIds(List<Long> userIds) { this.userIds = userIds; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
}
