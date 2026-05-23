package com.tcs.vidyutseva.service;

import com.tcs.vidyutseva.dto.request.AdminLogComplaintRequest;
import com.tcs.vidyutseva.dto.request.AssignSmeRequest;
import com.tcs.vidyutseva.dto.request.RaiseComplaintRequest;
import com.tcs.vidyutseva.dto.request.ResolveComplaintRequest;
import com.tcs.vidyutseva.dto.response.ComplaintResponse;
import com.tcs.vidyutseva.entity.Complaint;
import com.tcs.vidyutseva.entity.Consumer;
import com.tcs.vidyutseva.entity.UserAccount;
import com.tcs.vidyutseva.enums.ComplaintStatus;
import com.tcs.vidyutseva.enums.Role;
import com.tcs.vidyutseva.exception.ResourceNotFoundException;
import com.tcs.vidyutseva.repository.ComplaintRepository;
import com.tcs.vidyutseva.repository.ConsumerRepository;
import com.tcs.vidyutseva.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepo;
    private final ConsumerRepository consumerRepo;
    private final UserAccountRepository userRepo;

    public ComplaintResponse raiseComplaint(RaiseComplaintRequest req, Long userId) {
        UserAccount user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Complaint c = Complaint.builder()
            .consumer(user.getConsumer())
            .raisedBy(user)
            .description(req.getDescription())
            .category(req.getCategory())
            .status(ComplaintStatus.OPEN)
            .loggedByAdmin(false)
            .build();
        return toResponse(complaintRepo.save(c));
    }

    public ComplaintResponse adminLogComplaint(AdminLogComplaintRequest req, Long adminId) {
        Consumer consumer = consumerRepo.findById(req.getConsumerId())
            .orElseThrow(() -> new ResourceNotFoundException("Consumer not found"));
        UserAccount admin = userRepo.findById(adminId)
            .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        Complaint c = Complaint.builder()
            .consumer(consumer).raisedBy(admin)
            .description(req.getDescription()).category(req.getCategory())
            .status(ComplaintStatus.OPEN).loggedByAdmin(true)
            .build();
        return toResponse(complaintRepo.save(c));
    }

    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepo.findAll()
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ComplaintResponse> getAllActiveComplaints() {
        return complaintRepo.findByStatusIn(List.of(ComplaintStatus.OPEN, ComplaintStatus.ASSIGNED))
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ComplaintResponse assignSme(Long complaintId, AssignSmeRequest req) {
        Complaint c = complaintRepo.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        UserAccount sme = userRepo.findById(req.getSmeUserId())
            .orElseThrow(() -> new ResourceNotFoundException("SME not found"));
        if (sme.getRole() != Role.SME) throw new RuntimeException("User is not an SME");
        c.setAssignedSme(sme);
        c.setStatus(ComplaintStatus.ASSIGNED);
        return toResponse(complaintRepo.save(c));
    }

    public List<ComplaintResponse> getSmeAssignedComplaints(Long smeUserId) {
        return complaintRepo.findByAssignedSmeIdAndStatus(smeUserId, ComplaintStatus.ASSIGNED)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ComplaintResponse resolveComplaint(Long complaintId, ResolveComplaintRequest req) {
        Complaint c = complaintRepo.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        c.setStatus(ComplaintStatus.CLOSED);
        c.setResolvedAt(LocalDateTime.now());
        return toResponse(complaintRepo.save(c));
    }

    public List<ComplaintResponse> getComplaintsByConsumer(Long consumerId) {
        return complaintRepo.findByConsumerId(consumerId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ComplaintResponse getComplaintById(Long id) {
        Complaint c = complaintRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));
        return toResponse(c);
    }

    private ComplaintResponse toResponse(Complaint c) {
        return ComplaintResponse.builder()
            .id(c.getId())
            .consumerId(c.getConsumer().getId())
            .consumerName(c.getConsumer().getName())
            .description(c.getDescription())
            .category(c.getCategory().name())
            .status(c.getStatus().name())
            .assignedSmeId(c.getAssignedSme() != null ? c.getAssignedSme().getId() : null)
            .assignedSmeName(c.getAssignedSme() != null ? c.getAssignedSme().getUsername() : null)
            .loggedByAdmin(c.isLoggedByAdmin())
            .createdAt(c.getCreatedAt() != null ? c.getCreatedAt().toString() : null)
            .resolvedAt(c.getResolvedAt() != null ? c.getResolvedAt().toString() : null)
            .build();
    }
}
