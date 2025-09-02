package com.example.java_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.java_backend.model.Announcement;
import com.example.java_backend.model.AnnouncementRecipient;
import com.example.java_backend.model.User;

public interface AnnouncementRecipientRepository extends JpaRepository<AnnouncementRecipient, Long> {
    List<AnnouncementRecipient> findByAnnouncement(Announcement announcement);
	List<AnnouncementRecipient> findByUser(User user);

}
