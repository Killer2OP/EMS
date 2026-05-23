package com.tcs.vidyutseva.repository;

import com.tcs.vidyutseva.entity.Bill;
import com.tcs.vidyutseva.enums.BillStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByConsumerId(Long consumerId);
    List<Bill> findByConsumerIdAndStatus(Long consumerId, BillStatus status);
    boolean existsByConsumerIdAndBillingPeriod(Long consumerId, String billingPeriod);
    List<Bill> findByConsumerIdAndStatusIn(Long consumerId, List<BillStatus> statuses);

    @Query("SELECT COUNT(b) FROM Bill b WHERE MONTH(b.generatedAt) = MONTH(CURRENT_DATE) AND YEAR(b.generatedAt) = YEAR(CURRENT_DATE)")
    long countBillsGeneratedThisMonth();

    @Query("SELECT COALESCE(SUM(p.amountPaid), 0) FROM Payment p WHERE p.paymentStatus = com.tcs.vidyutseva.enums.PaymentStatus.SUCCESS")
    Double getTotalRevenue();
}
