package com.tcs.vidyutseva.repository;

import com.tcs.vidyutseva.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByConsumerId(Long consumerId);
    Optional<Payment> findByBillId(Long billId);

    @Query("SELECT COUNT(p) FROM Payment p WHERE CAST(p.paidAt AS date) = CURRENT_DATE AND p.paymentMode IN (com.tcs.vidyutseva.enums.PaymentMode.CASH, com.tcs.vidyutseva.enums.PaymentMode.CARD) AND p.processedByAdmin IS NOT NULL")
    long countWalkinPaymentsToday();
}
