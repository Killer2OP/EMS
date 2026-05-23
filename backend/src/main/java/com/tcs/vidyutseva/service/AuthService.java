package com.tcs.vidyutseva.service;

import com.tcs.vidyutseva.dto.request.LoginRequest;
import com.tcs.vidyutseva.dto.request.RegisterRequest;
import com.tcs.vidyutseva.dto.response.AuthResponse;
import com.tcs.vidyutseva.entity.Consumer;
import com.tcs.vidyutseva.entity.UserAccount;
import com.tcs.vidyutseva.enums.Role;
import com.tcs.vidyutseva.exception.ConsumerNotFoundException;
import com.tcs.vidyutseva.repository.ConsumerRepository;
import com.tcs.vidyutseva.repository.UserAccountRepository;
import com.tcs.vidyutseva.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAccountRepository userRepo;
    private final ConsumerRepository consumerRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByUsername(req.getUsername()))
            throw new RuntimeException("Username already taken");
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");

        Consumer consumer = consumerRepo.findByConsumerNumber(req.getConsumerNumber())
            .orElseThrow(() -> new ConsumerNotFoundException("No consumer found with number: " + req.getConsumerNumber()));

        if (consumer.getLinkedUser() != null)
            throw new RuntimeException("This consumer number is already linked to another account");

        UserAccount user = UserAccount.builder()
            .username(req.getUsername())
            .passwordHash(passwordEncoder.encode(req.getPassword()))
            .email(req.getEmail())
            .phone(req.getPhone())
            .role(Role.CUSTOMER)
            .consumer(consumer)
            .isActive(true)
            .build();

        user = userRepo.save(user);
        consumer.setLinkedUser(user);
        consumerRepo.save(consumer);

        String token = jwtUtil.generateToken(user);
        return AuthResponse.builder()
            .token(token).role(user.getRole().name())
            .userId(user.getId()).username(user.getUsername())
            .consumerId(consumer.getId())
            .build();
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));

        UserAccount user = userRepo.findByUsername(req.getUsername())
            .orElseGet(() -> userRepo.findByEmail(req.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found")));

        String token = jwtUtil.generateToken(user);
        return AuthResponse.builder()
            .token(token).role(user.getRole().name())
            .userId(user.getId()).username(user.getUsername())
            .consumerId(user.getConsumer() != null ? user.getConsumer().getId() : null)
            .build();
    }
}
