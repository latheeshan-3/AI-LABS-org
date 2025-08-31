package com.example.java_backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.java_backend.dto.user.UpdateUserDTO;
import com.example.java_backend.dto.user.UserDTO;
import com.example.java_backend.mapper.UserMapper;
import com.example.java_backend.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<UserDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(UserMapper::toDTO);
    }

    public UserDTO updateUser(Long id, UpdateUserDTO updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(updatedUser.getFullName());
            user.setHometown(updatedUser.getHometown());
            user.setContactNumber(updatedUser.getContactNumber());
            user.setStatus(updatedUser.getStatus());
            user.setNic(updatedUser.getNic());
            user.setSex(updatedUser.getSex());
            user.setDateOfBirth(updatedUser.getDateOfBirth());
            user.setAccountStatus(updatedUser.getaccountStatus);
            return UserMapper.toDTO(userRepository.save(user));
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }
}
