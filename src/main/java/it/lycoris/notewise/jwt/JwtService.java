package it.lycoris.notewise.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.impl.lang.Function;
import it.lycoris.notewise.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {
    private static final Logger LOG = LoggerFactory.getLogger(JwtService.class);
    private final JwtProperties properties;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
    }

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(extractClaim(token, claims -> claims.get("id", String.class)));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Throwable t) {
            LOG.error("Error extracting claims from JWT token", t);
            throw t;
        }
    }

    public String generateToken(Map<String, Object> extraClaims, User user, long expiration) {
        try {
            return Jwts.builder()
                    .claims()
                    .empty()
                    .add(extraClaims)
                    .and()
                    .subject(user.getUsername())
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + expiration * 1000))
                    .signWith(getKey())
                    .compact();
        } catch (Throwable t) {
            LOG.error("Error generating JWT token for user: '{}'", user.getId(), t);
            throw t;
        }
    }

    public String generateAccessToken(User user) {
        return generateToken(Map.of(
                "roles", user.getRoles()
        ), user, properties.accessTokenExpiration());
    }

    public String generateRefreshToken(User user) {
        return generateToken(Map.of(), user, properties.refreshTokenExpiration());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String tokenUsername = extractSubject(token);
        return tokenUsername.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private SecretKey getKey() {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = digest.digest(properties.secret().getBytes(StandardCharsets.UTF_8));
            return new SecretKeySpec(keyBytes, "HmacSHA256");
        } catch (NoSuchAlgorithmException ignored) {
            throw new RuntimeException("Error generating JWT secret key");
        }
    }
}