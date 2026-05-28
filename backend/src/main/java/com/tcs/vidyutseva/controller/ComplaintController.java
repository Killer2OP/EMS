package com.tcs.vidyutseva.controller;

import com.tcs.vidyutseva.dto.request.AdminLogComplaintRequest;
import com.tcs.vidyutseva.dto.request.AssignSmeRequest;
import com.tcs.vidyutseva.dto.request.RaiseComplaintRequest;
import com.tcs.vidyutseva.dto.request.ResolveComplaintRequest;
import com.tcs.vidyutseva.dto.response.ComplaintResponse;
import com.tcs.vidyutseva.enums.Role;
import com.tcs.vidyutseva.repository.UserAccountRepository;
import com.tcs.vidyutseva.dto.response.AuthResponse;
import com.tcs.vidyutseva.security.JwtUtil;
import com.tcs.vidyutseva.service.ComplaintService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {
    private final ComplaintService complaintService;
    private final JwtUtil jwtUtil;
    private final UserAccountRepository userRepo;

    @PostMapping
    public ResponseEntity<ComplaintResponse> raiseComplaint(@Valid @RequestBody RaiseComplaintRequest req,
                                                            HttpServletRequest httpReq) {
        Long userId = extractUserId(httpReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.raiseComplaint(req, userId));
    }

    @PostMapping("/admin-log")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintResponse> adminLogComplaint(@Valid @RequestBody AdminLogComplaintRequest req,
                                                                HttpServletRequest httpReq) {
        Long adminId = extractUserId(httpReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.adminLogComplaint(req, adminId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintResponse>> getActiveComplaints() {
        return ResponseEntity.ok(complaintService.getAllActiveComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable Long id, HttpServletRequest request) {
        Long userId = extractUserId(request);
        return ResponseEntity.ok(complaintService.getComplaintById(id, userId));
    }

    @PutMapping("/{complaintId}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintResponse> assignSme(@PathVariable Long complaintId,
                                                        @Valid @RequestBody AssignSmeRequest req) {
        return ResponseEntity.ok(complaintService.assignSme(complaintId, req));
    }

    @GetMapping("/sme/assigned")
    @PreAuthorize("hasRole('SME')")
    public ResponseEntity<List<ComplaintResponse>> getSmeAssignedComplaints(HttpServletRequest httpReq) {
        Long smeId = extractUserId(httpReq);
        return ResponseEntity.ok(complaintService.getSmeAssignedComplaints(smeId));
    }

    @PutMapping("/{complaintId}/resolve")
    @PreAuthorize("hasRole('SME')")
    public ResponseEntity<ComplaintResponse> resolveComplaint(@PathVariable Long complaintId,
                                                               @Valid @RequestBody ResolveComplaintRequest req) {
        return ResponseEntity.ok(complaintService.resolveComplaint(complaintId, req));
    }

    @GetMapping("/consumer/{consumerId}")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsByConsumer(@PathVariable Long consumerId, HttpServletRequest request) {
        Long userId = extractUserId(request);
        return ResponseEntity.ok(complaintService.getComplaintsByConsumer(consumerId, userId));
    }

    @GetMapping("/sme-list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getSmeList() {
        return ResponseEntity.ok(
            userRepo.findByRole(Role.SME).stream()
                .map(sme -> Map.<String, Object>of(
                    "id", sme.getId(),
                    "username", sme.getUsername(),
                    "email", sme.getEmail()
                ))
                .collect(Collectors.toList())
        );
    }

    private Long extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }
}
