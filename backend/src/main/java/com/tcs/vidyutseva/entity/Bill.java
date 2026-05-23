package com.tcs.vidyutseva.entity;

import com.tcs.vidyutseva.enums.BillStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills",
       uniqueConstraints = @UniqueConstraint(columnNames = {"consumer_id", "billing_period"}))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Bill {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consumer_id", nullable = false)
    private Consumer consumer;

    @Column(name = "billing_period", nullable = false, length = 7)
    private String billingPeriod;

    @Column(name = "units_consumed", nullable = false)
    private Double unitsConsumed;

    @Column(name = "amount_due", nullable = false)
    private Double amountDue;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BillStatus status = BillStatus.UNPAID;

    @Column(name = "generated_at")
    @Builder.Default
    private LocalDateTime generatedAt = LocalDateTime.now();
}
