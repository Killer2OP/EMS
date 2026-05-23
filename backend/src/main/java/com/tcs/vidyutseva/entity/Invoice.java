package com.tcs.vidyutseva.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Invoice {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", unique = true, nullable = false)
    private Payment payment;

    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber;

    @Column(name = "generated_at")
    @Builder.Default
    private LocalDateTime generatedAt = LocalDateTime.now();
}
