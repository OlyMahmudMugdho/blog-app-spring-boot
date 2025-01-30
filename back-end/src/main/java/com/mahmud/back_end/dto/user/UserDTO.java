package com.mahmud.back_end.dto.user;

import com.mahmud.back_end.model.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String bio;
    private String profilePicture;
    private Set<Role> roles;
    private int followersCount;
    private int followingCount;
    private boolean isFollowing;
} 