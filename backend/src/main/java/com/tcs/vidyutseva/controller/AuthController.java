package com.tcs.vidyutseva.controller;

import com.tcs.vidyutseva.dto.request.LoginRequest;
import com.tcs.vidyutseva.dto.request.RegisterRequest;
import com.tcs.vidyutseva.dto.response.AuthResponse;
import com.tcs.vidyutseva.dto.request.ResetPasswordRequest;
import com.tcs.vidyutseva.security.JwtUtil;
import com.tcs.vidyutseva.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Successfully logged out");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            HttpServletRequest request,
            @Valid @RequestBody ResetPasswordRequest req) {
        String token = request.getHeader("Authorization").substring(7);
        Long userId = jwtUtil.extractUserId(token);
        authService.resetPassword(userId, req);
        return ResponseEntity.ok("Password reset successfully");
    }
}
