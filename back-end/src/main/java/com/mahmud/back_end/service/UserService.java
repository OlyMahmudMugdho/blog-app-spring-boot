package com.mahmud.back_end.service;

import com.mahmud.back_end.dto.user.UserDTO;
import com.mahmud.back_end.dto.user.UserProfileUpdateRequest;
import com.mahmud.back_end.exception.ResourceNotFoundException;
import com.mahmud.back_end.model.user.User;
import com.mahmud.back_end.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO getCurrentUser() {
        return convertToDTO(getAuthenticatedUser());
    }

    public UserDTO getUserProfile(String username) {
        User currentUser = getAuthenticatedUser();
        User targetUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        
        return convertToDTO(targetUser, currentUser);
    }

    @Transactional
    public UserDTO updateProfile(Long userId, UserProfileUpdateRequest request) {
        User currentUser = getAuthenticatedUser();
        if (!currentUser.getId().equals(userId)) {
            throw new IllegalArgumentException("You can only update your own profile");
        }

        if (request.getEmail() != null && !request.getEmail().equals(currentUser.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }
            currentUser.setEmail(request.getEmail());
        }

        if (request.getName() != null) {
            currentUser.setName(request.getName());
        }

        if (request.getBio() != null) {
            currentUser.setBio(request.getBio());
        }

        if (request.getProfilePicture() != null) {
            currentUser.setProfilePicture(request.getProfilePicture());
        }

        if (request.getNewPassword() != null) {
            if (request.getCurrentPassword() == null || 
                !passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }
            currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        return convertToDTO(userRepository.save(currentUser));
    }

    @Transactional
    public UserDTO followUser(Long userId) {
        User currentUser = getAuthenticatedUser();
        User userToFollow = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (currentUser.getId().equals(userId)) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }

        if (currentUser.getFollowing().contains(userToFollow)) {
            throw new IllegalArgumentException("You are already following this user");
        }

        currentUser.getFollowing().add(userToFollow);
        userToFollow.getFollowers().add(currentUser);

        userRepository.save(currentUser);
        return convertToDTO(userToFollow, currentUser);
    }

    @Transactional
    public UserDTO unfollowUser(Long userId) {
        User currentUser = getAuthenticatedUser();
        User userToUnfollow = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!currentUser.getFollowing().contains(userToUnfollow)) {
            throw new IllegalArgumentException("You are not following this user");
        }

        currentUser.getFollowing().remove(userToUnfollow);
        userToUnfollow.getFollowers().remove(currentUser);

        userRepository.save(currentUser);
        return convertToDTO(userToUnfollow, currentUser);
    }

    public List<UserDTO> getFollowers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        User currentUser = getAuthenticatedUser();
        
        return user.getFollowers().stream()
                .map(follower -> convertToDTO(follower, currentUser))
                .collect(Collectors.toList());
    }

    public List<UserDTO> getFollowing(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        User currentUser = getAuthenticatedUser();
        
        return user.getFollowing().stream()
                .map(following -> convertToDTO(following, currentUser))
                .collect(Collectors.toList());
    }

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authentication user not found"));
    }

    private UserDTO convertToDTO(User user) {
        return convertToDTO(user, null);
    }

    private UserDTO convertToDTO(User user, User currentUser) {
        boolean isFollowing = false;
        if (currentUser != null && !currentUser.getId().equals(user.getId())) {
            isFollowing = currentUser.getFollowing().contains(user);
        }

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .roles(user.getRoles())
                .followersCount(user.getFollowers().size())
                .followingCount(user.getFollowing().size())
                .isFollowing(isFollowing)
                .build();
    }
} 