package com.tcs.vidyutseva.entity;

import com.tcs.vidyutseva.enums.TariffType;
import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consumers")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Consumer {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "consumer_number", unique = true, nullable = false, length = 13)
    @NotBlank
    @Pattern(regexp = "^\\d{13}$")
    private String consumerNumber;

    @Column(nullable = false, length = 50)
    @NotBlank
    @Size(min = 3, max = 50)
    private String name;

    @Column(nullable = false, length = 150)
    @NotBlank
    @Size(min = 5, max = 150)
    private String address;

    @Column(name = "meter_number", nullable = false, length = 20)
    @NotBlank
    @Pattern(regexp = "^MTR-\\d{3,6}$")
    private String meterNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "tariff_type", nullable = false)
    private TariffType tariffType;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "linked_user_id")
    private UserAccount linkedUser;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
