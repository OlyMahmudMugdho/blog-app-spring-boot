package com.mahmud.back_end.service;

import com.mahmud.back_end.model.user.User;
import com.mahmud.back_end.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.password-reset.expiration}")
    private long resetTokenExpiration;

    public void sendPasswordResetEmail(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        String token = generateResetToken();
        user.setResetToken(token);
        user.setResetTokenExpiry(Instant.now().plusMillis(resetTokenExpiration));
        userRepository.save(user);

        sendResetEmail(user.getEmail(), token);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    private void sendResetEmail(String email, String token) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("Reset Your Password");
        helper.setText(createResetEmailContent(token), true);

        mailSender.send(message);
    }

    private String createResetEmailContent(String token) {
        String resetLink = frontendUrl + "/auth/reset-password?token=" + token;
        return String.format("""
            <html>
                <body>
                    <h2>Reset Your Password</h2>
                    <p>Click the link below to reset your password. This link will expire in 15 minutes.</p>
                    <p><a href="%s">Reset Password</a></p>
                    <p>If you didn't request this, please ignore this email.</p>
                </body>
            </html>
            """, resetLink);
    }
} 