package com.bbps.controller;

import com.bbps.dto.AuthRequest;
import com.bbps.dto.AuthResponse;
import com.bbps.dto.ForgotPasswordRequest;
import com.bbps.exception.BadRequestException;
import com.bbps.exception.ResourceNotFoundException;
import com.bbps.model.AccountStatus;
import com.bbps.model.User;
import com.bbps.repository.UserRepository;
import com.bbps.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        User user = userRepository.findByEmployeeIdOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (user.getStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException("Your account is currently " + user.getStatus() + ". Please contact administrator.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmployeeId(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse(
                jwt,
                user.getId(),
                user.getEmployeeId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getDepartment(),
                user.getDesignation(),
                user.getSupervisorEmployeeId(),
                user.getPaidLeaveBalance()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            throw new BadRequestException("Not authenticated");
        }
        User user = userRepository.findByEmployeeId(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        AuthResponse response = new AuthResponse(
                null,
                user.getId(),
                user.getEmployeeId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getDepartment(),
                user.getDesignation(),
                user.getSupervisorEmployeeId(),
                user.getPaidLeaveBalance()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        User user = userRepository.findByEmployeeIdOrEmail(request.getIdentifier(), request.getIdentifier())
                .orElseThrow(() -> new ResourceNotFoundException("No account found with identifier: " + request.getIdentifier()));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password has been successfully updated. Please login with your new password."));
    }
}
