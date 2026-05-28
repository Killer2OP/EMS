package com.tcs.vidyutseva.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username is required") @jakarta.validation.constraints.Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters") private String username;
    @NotBlank @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$", message = "Invalid email format") private String email;
    @NotBlank @Pattern(regexp = "^\\d{10}$", message = "Phone must be 10 digits") private String phone;
    @NotBlank @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$", message = "Password must be at least 8 characters, include a letter, number and special character") private String password;
}
