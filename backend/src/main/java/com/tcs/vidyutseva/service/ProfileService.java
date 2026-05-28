package com.tcs.vidyutseva.service;

import com.tcs.vidyutseva.dto.request.UpdateProfileRequest;
import com.tcs.vidyutseva.dto.response.ProfileResponse;
import com.tcs.vidyutseva.entity.UserAccount;
import com.tcs.vidyutseva.exception.ResourceNotFoundException;
import com.tcs.vidyutseva.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserAccountRepository userRepo;

    public ProfileResponse getProfile(Long userId) {
        UserAccount user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToResponse(user);
    }

    public ProfileResponse updateProfile(Long userId, UpdateProfileRequest req) {
        UserAccount user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Check email uniqueness if changed
        if (!user.getEmail().equals(req.getEmail()) && userRepo.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        return mapToResponse(userRepo.save(user));
    }

    private ProfileResponse mapToResponse(UserAccount user) {
        return ProfileResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(user.getRole().name())
            .consumerId(user.getConsumer() != null ? user.getConsumer().getId() : null)
            .build();
    }
}
