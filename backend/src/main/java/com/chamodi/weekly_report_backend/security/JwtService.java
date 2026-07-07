package com.chamodi.weekly_report_backend.security;

import com.chamodi.weekly_report_backend.model.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class JwtService {
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private final String secret;
    private final long expirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration}") long expirationMs
    ) {
        this.secret = secret;
        this.expirationMs = expirationMs;
    }

    public String generateToken(User user) {
        Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", user.getEmail());
        payload.put("uid", user.getId());
        payload.put("role", user.getRole().name());
        payload.put("iat", Instant.now().getEpochSecond());
        payload.put("exp", Instant.now().plusMillis(expirationMs).getEpochSecond());

        String encodedHeader = base64Url(toJson(header));
        String encodedPayload = base64Url(toJson(payload));
        String unsignedToken = encodedHeader + "." + encodedPayload;
        return unsignedToken + "." + sign(unsignedToken);
    }

    public String extractSubject(String token) {
        try {
            Map<String, Object> payload = payload(token);
            return (String) payload.get("sub");
        } catch (RuntimeException ex) {
            return null;
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String subject = extractSubject(token);
        return subject != null
                && subject.equals(userDetails.getUsername())
                && !isExpired(token)
                && signatureMatches(token);
    }

    private boolean isExpired(String token) {
        Map<String, Object> payload = payload(token);
        Number exp = (Number) payload.get("exp");
        return exp == null || Instant.now().getEpochSecond() >= exp.longValue();
    }

    private boolean signatureMatches(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return false;
        }
        String expected = sign(parts[0] + "." + parts[1]);
        return MessageDigestUtil.constantTimeEquals(expected, parts[2]);
    }

    private Map<String, Object> payload(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid token");
        }
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            return MAPPER.readValue(decoded, new TypeReference<>() {
            });
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid token", ex);
        }
    }

    private String toJson(Object value) {
        try {
            return MAPPER.writeValueAsString(value);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to create JWT", ex);
        }
    }

    private String base64Url(String value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to sign JWT", ex);
        }
    }
}
