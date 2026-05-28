package com.tcs.vidyutseva.controller;

import com.tcs.vidyutseva.dto.request.UpdateProfileRequest;
import com.tcs.vidyutseva.dto.response.ProfileResponse;
import com.tcs.vidyutseva.security.JwtUtil;
import com.tcs.vidyutseva.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(HttpServletRequest request) {
        Long userId = extractUserId(request);
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            HttpServletRequest request,
            @Valid @RequestBody UpdateProfileRequest req) {
        Long userId = extractUserId(request);
        return ResponseEntity.ok(profileService.updateProfile(userId, req));
    }

    private Long extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }
}
