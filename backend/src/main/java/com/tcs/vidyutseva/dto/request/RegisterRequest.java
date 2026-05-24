package com.tcs.vidyutseva.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String username;
    @NotBlank @Email private String email;
    @NotBlank @Pattern(regexp = "^\\d{10}$", message = "Phone must be 10 digits") private String phone;
    @NotBlank @Size(min = 8) private String password;
}
