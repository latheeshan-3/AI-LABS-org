package com.example.java_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.java_backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    // repository/UserRepository.java
List<User> findAllByIdIn(List<Long> ids);
List<User> findByBatchId(String batchId);

}
