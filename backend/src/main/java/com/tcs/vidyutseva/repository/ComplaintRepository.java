package com.tcs.vidyutseva.repository;

import com.tcs.vidyutseva.entity.Complaint;
import com.tcs.vidyutseva.enums.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStatusIn(List<ComplaintStatus> statuses);
    List<Complaint> findByAssignedSmeIdAndStatus(Long smeId, ComplaintStatus status);
    List<Complaint> findByConsumerId(Long consumerId);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = com.tcs.vidyutseva.enums.ComplaintStatus.OPEN")
    long countOpenComplaints();

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = com.tcs.vidyutseva.enums.ComplaintStatus.ASSIGNED")
    long countAssignedComplaints();
}
