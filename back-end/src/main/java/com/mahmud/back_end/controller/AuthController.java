package com.mahmud.back_end.controller;

import com.mahmud.back_end.dto.auth.*;
import com.mahmud.back_end.service.AuthService;
import com.mahmud.back_end.service.PasswordResetService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.sendPasswordResetEmail(request.getEmail());
            return ResponseEntity.ok(new MessageResponse("Password reset instructions sent to your email"));
        } catch (IllegalArgumentException e) {
            // Don't reveal if the email exists or not for security reasons
            return ResponseEntity.ok(new MessageResponse("If an account exists with that email, you will receive password reset instructions"));
        } catch (MessagingException e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Failed to send reset email. Please try again later."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(new MessageResponse("Password has been reset successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }
} 