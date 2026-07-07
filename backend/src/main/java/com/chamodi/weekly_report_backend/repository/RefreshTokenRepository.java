package com.chamodi.weekly_report_backend.repository;

import com.chamodi.weekly_report_backend.model.RefreshToken;
import com.chamodi.weekly_report_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser(User user);

    void deleteByUser(User user);
}
