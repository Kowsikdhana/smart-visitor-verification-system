package com.example.visitor.controller;

import com.example.visitor.dto.AuthRequest;
import com.example.visitor.dto.AuthResponse;
import com.example.visitor.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AuthController manages authentication endpoints.
 *
 * Concepts explained:
 * - @RestController: Combines @Controller and @ResponseBody. Tells Spring that every method
 *   returns JSON/XML response bodies directly to the HTTP client.
 * - @RequestMapping("/api/auth"): Sets the base URL path prefix for all endpoints in this class.
 * - @Valid: Triggers Hibernate Bean Validation on the incoming request body before the method runs.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
