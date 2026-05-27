package com.tcs.vidyutseva.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Vidyutseva – Electricity Management System API",
        version = "1.0",
        description = "REST API for VidyutSeva EMS. " +
                      "Register or Login first to get a JWT token, " +
                      "then click Authorize 🔒 and paste: Bearer <your_token>"
    ),
    security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER,
    description = "Paste your JWT token here (without the 'Bearer' prefix – Swagger adds it automatically)"
)
public class SwaggerConfig {
    // No beans needed – annotations do all the work
}
