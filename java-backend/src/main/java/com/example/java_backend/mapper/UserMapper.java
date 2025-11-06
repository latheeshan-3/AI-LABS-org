package com.example.java_backend.mapper;

import com.example.java_backend.dto.user.UserDTO;
import com.example.java_backend.model.User;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setHometown(user.getHometown());
        dto.setContactNumber(user.getContactNumber());
        dto.setStatus(user.getStatus());
        dto.setNic(user.getNic());
        dto.setSex(user.getSex());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setAccountStatus(user.getAccountStatus());
        dto.setStudentId(user.getStudentId()); // ✅ add this
        dto.setBatchId(user.getBatchId()); 
        dto.setVerified(user.isVerified());   

        return dto;
    }

    
}
