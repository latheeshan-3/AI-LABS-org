package com.example.java_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.java_backend.model.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
}
