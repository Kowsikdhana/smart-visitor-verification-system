package com.example.visitor.service;

import com.example.visitor.config.JwtTokenProvider;
import com.example.visitor.dto.AuthRequest;
import com.example.visitor.dto.AuthResponse;
import com.example.visitor.entity.User;
import com.example.visitor.exception.BadRequestException;
import com.example.visitor.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * AuthService handles security guard sign-in and token issuance.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole());

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getFullName(),
                user.getRole()
        );
    }
}
