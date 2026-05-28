package com.tcs.vidyutseva.entity;

import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "cards")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Card {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "card_number", unique = true, nullable = false, length = 16)
    @NotBlank
    @Pattern(regexp = "^\\d{16}$")
    private String cardNumber;

    @Column(name = "card_holder_name", nullable = false, length = 100)
    @NotBlank
    @Pattern(regexp = "^[a-zA-Z\\s]+$")
    private String cardHolderName;

    @Column(name = "cvv", nullable = false, length = 4)
    @NotBlank
    @Pattern(regexp = "^\\d{3,4}$")
    private String cvv;

    @Column(name = "expiry_date", nullable = false, length = 5)
    @NotBlank
    @Pattern(regexp = "^(0[1-9]|1[0-2])\\/\\d{2}$")
    private String expiryDate;
}
