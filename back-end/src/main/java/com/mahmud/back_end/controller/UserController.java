package com.mahmud.back_end.controller;

import com.mahmud.back_end.dto.user.UserDTO;
import com.mahmud.back_end.dto.user.UserProfileUpdateRequest;
import com.mahmud.back_end.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUserProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    @PutMapping("/{id}")
    @PreAuthorize("#id == authentication.principal.id")
    public ResponseEntity<UserDTO> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UserProfileUpdateRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(id, request));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<UserDTO> followUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.followUser(id));
    }

    @DeleteMapping("/{id}/unfollow")
    public ResponseEntity<UserDTO> unfollowUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.unfollowUser(id));
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<List<UserDTO>> getFollowers(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getFollowers(id));
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<List<UserDTO>> getFollowing(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getFollowing(id));
    }
} 
