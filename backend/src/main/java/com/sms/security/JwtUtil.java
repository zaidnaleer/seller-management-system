package com.sms.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Issues signed JWTs at login/register time. This is the counterpart to
 * JwtValidator, which only verifies tokens — this class creates them.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    // Token lifetime — 1 hour. Adjust later based on your app's needs.
    private static final long EXPIRATION_MS = 1000 * 60 * 60;

    public String generateToken(String subject, String role) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        Date now = new Date();
        Date expiry = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .subject(subject)          // typically the user's email or id
                .claim("role", role)       // custom claim, so we can check permissions later
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }
}