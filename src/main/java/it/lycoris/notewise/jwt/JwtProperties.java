package it.lycoris.notewise.jwt;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
        @NotNull @Size(min = 16) String secret,
        @Min(60) @DefaultValue("900") int accessTokenExpiration,
        @Min(60) @DefaultValue("2592000") int refreshTokenExpiration
) {
}