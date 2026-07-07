package com.chamodi.weekly_report_backend.auth;

import com.chamodi.weekly_report_backend.dto.AuthResponse;
import com.chamodi.weekly_report_backend.dto.LoginRequest;
import com.chamodi.weekly_report_backend.dto.RegisterRequest;
import com.chamodi.weekly_report_backend.dto.RefreshTokenRequest;
import com.chamodi.weekly_report_backend.dto.UserResponse;
import com.chamodi.weekly_report_backend.exception.ConflictException;
import com.chamodi.weekly_report_backend.model.Role;
import com.chamodi.weekly_report_backend.model.User;
import com.chamodi.weekly_report_backend.repository.UserRepository;
import com.chamodi.weekly_report_backend.security.JwtService;
import com.chamodi.weekly_report_backend.service.RefreshTokenService;
import com.chamodi.weekly_report_backend.service.UserMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserMapper userMapper;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.userMapper = userMapper;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email is already registered");
        }

        Role role = request.role() == null ? Role.TEAM_MEMBER : request.role();
        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);
        return toAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
        );
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow();
        return toAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        User user = refreshTokenService.validateAndGetUser(request.refreshToken());
        return toAuthResponse(user);
    }

    @Transactional
    public void logout(RefreshTokenRequest request) {
        refreshTokenService.deleteByToken(request.refreshToken());
    }

    private AuthResponse toAuthResponse(User user) {
        String accessToken = jwtService.generateToken(user);
        String refreshToken = refreshTokenService.createOrReplace(user);
        UserResponse response = userMapper.toResponse(user);
        return new AuthResponse(accessToken, refreshToken, "Bearer", response);
    }
}
