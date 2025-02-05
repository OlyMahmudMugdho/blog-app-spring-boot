package com.mahmud.back_end.service;

import com.mahmud.back_end.dto.post.PostCreateRequest;
import com.mahmud.back_end.dto.post.PostDTO;
import com.mahmud.back_end.dto.post.PostUpdateRequest;
import com.mahmud.back_end.dto.user.UserDTO;
import com.mahmud.back_end.model.post.Post;
import com.mahmud.back_end.model.user.User;
import com.mahmud.back_end.repository.PostRepository;
import com.mahmud.back_end.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Page<PostDTO> getAllPosts(Pageable pageable) {
        User currentUser = getAuthenticatedUser();
        return postRepository.findByPublishedTrue(pageable)
                .map(post -> convertToDTO(post, currentUser));
    }

    public Page<PostDTO> getPostsByUser(String username, Pageable pageable) {
        User currentUser = getAuthenticatedUser();
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return postRepository.findByAuthorAndPublishedTrue(author, pageable)
                .map(post -> convertToDTO(post, currentUser));
    }

    public PostDTO getPost(Long id) {
        User currentUser = getAuthenticatedUser();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.isPublished() && !post.getAuthor().equals(currentUser)) {
            throw new IllegalArgumentException("Post not found");
        }

        post.setViewCount(post.getViewCount() + 1);
        return convertToDTO(postRepository.save(post), currentUser);
    }

    @Transactional
    public PostDTO createPost(PostCreateRequest request) {
        User currentUser = getAuthenticatedUser();

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(currentUser)
                .tags(request.getTags() != null ? request.getTags() : new HashSet<>())
                .coverImage(request.getCoverImage())
                .published(request.isPublished())
                .build();

        return convertToDTO(postRepository.save(post), currentUser);
    }

    @Transactional
    public PostDTO updatePost(Long id, PostUpdateRequest request) {
        User currentUser = getAuthenticatedUser();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.getAuthor().equals(currentUser)) {
            throw new IllegalArgumentException("You can only update your own posts");
        }

        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            post.setContent(request.getContent());
        }
        if (request.getTags() != null) {
            post.setTags(request.getTags());
        }
        if (request.getCoverImage() != null) {
            post.setCoverImage(request.getCoverImage());
        }
        if (request.getPublished() != null) {
            post.setPublished(request.getPublished());
        }

        return convertToDTO(postRepository.save(post), currentUser);
    }

    @Transactional
    public void deletePost(Long id) {
        User currentUser = getAuthenticatedUser();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.getAuthor().equals(currentUser)) {
            throw new IllegalArgumentException("You can only delete your own posts");
        }

        postRepository.delete(post);
    }

    @Transactional
    public PostDTO likePost(Long id) {
        User currentUser = getAuthenticatedUser();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (post.getLikes().contains(currentUser)) {
            throw new IllegalArgumentException("You have already liked this post");
        }

        post.getLikes().add(currentUser);
        return convertToDTO(postRepository.save(post), currentUser);
    }

    @Transactional
    public PostDTO unlikePost(Long id) {
        User currentUser = getAuthenticatedUser();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.getLikes().contains(currentUser)) {
            throw new IllegalArgumentException("You haven't liked this post");
        }

        post.getLikes().remove(currentUser);
        return convertToDTO(postRepository.save(post), currentUser);
    }

    @Transactional
    public PostDTO bookmarkPost(Long id) {
        User currentUser = getAuthenticatedUser();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (post.getBookmarks().contains(currentUser)) {
            throw new IllegalArgumentException("You have already bookmarked this post");
        }

        post.getBookmarks().add(currentUser);
        return convertToDTO(postRepository.save(post), currentUser);
    }

    @Transactional
    public PostDTO removeBookmark(Long id) {
        User currentUser = getAuthenticatedUser();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.getBookmarks().contains(currentUser)) {
            throw new IllegalArgumentException("You haven't bookmarked this post");
        }

        post.getBookmarks().remove(currentUser);
        return convertToDTO(postRepository.save(post), currentUser);
    }

    public Page<PostDTO> searchPosts(String query, Pageable pageable) {
        User currentUser = getAuthenticatedUser();
        return postRepository.searchPosts(query, pageable)
                .map(post -> convertToDTO(post, currentUser));
    }

    public Page<PostDTO> getPostsByTag(String tag, Pageable pageable) {
        User currentUser = getAuthenticatedUser();
        return postRepository.findByTag(tag, pageable)
                .map(post -> convertToDTO(post, currentUser));
    }

    public Page<PostDTO> getFeed(Pageable pageable) {
        User currentUser = getAuthenticatedUser();
        List<User> following = currentUser.getFollowing().stream().toList();
        return postRepository.findByFollowing(following, pageable)
                .map(post -> convertToDTO(post, currentUser));
    }

    private User getAuthenticatedUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName().equals("anonymousUser")) {
            return null;
        }
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Authentication user not found"));
    }

    private PostDTO convertToDTO(Post post, User currentUser) {
        return PostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(convertToUserDTO(post.getAuthor()))
                .tags(post.getTags())
                .coverImage(post.getCoverImage())
                .viewCount(post.getViewCount())
                .likesCount(post.getLikes().size())
                .commentsCount(0) // TODO: Implement comment count
                .bookmarksCount(post.getBookmarks().size())
                .isLiked(currentUser != null && post.getLikes().contains(currentUser))
                .isBookmarked(currentUser != null && post.getBookmarks().contains(currentUser))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private UserDTO convertToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .profilePicture(user.getProfilePicture())
                .build();
    }
} 