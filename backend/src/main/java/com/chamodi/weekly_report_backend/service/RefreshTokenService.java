package com.chamodi.weekly_report_backend.service;

import com.chamodi.weekly_report_backend.exception.UnauthorizedActionException;
import com.chamodi.weekly_report_backend.model.RefreshToken;
import com.chamodi.weekly_report_backend.model.User;
import com.chamodi.weekly_report_backend.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final long refreshTokenExpiration;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${jwt.refresh-token-expiration}") long refreshTokenExpiration
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    public String createOrReplace(User user) {
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user).orElseGet(RefreshToken::new);
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenExpiration));
        return refreshTokenRepository.save(refreshToken).getToken();
    }

    public User validateAndGetUser(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedActionException("Invalid refresh token"));
        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedActionException("Refresh token expired");
        }
        return refreshToken.getUser();
    }

    public void deleteByToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
    }
}
