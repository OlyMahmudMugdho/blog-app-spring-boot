package com.mahmud.back_end.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateRequest {
    @Size(max = 50)
    private String name;

    @Email
    @Size(max = 100)
    private String email;

    @Size(max = 500)
    private String bio;

    private String profilePicture;

    @Size(min = 6)
    private String newPassword;

    private String currentPassword;
} 