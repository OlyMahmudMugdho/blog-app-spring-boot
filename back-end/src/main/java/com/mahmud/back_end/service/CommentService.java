package com.mahmud.back_end.service;

import com.mahmud.back_end.dto.comment.CommentCreateRequest;
import com.mahmud.back_end.dto.comment.CommentDTO;
import com.mahmud.back_end.dto.comment.CommentUpdateRequest;
import com.mahmud.back_end.dto.user.UserDTO;
import com.mahmud.back_end.model.comment.Comment;
import com.mahmud.back_end.model.post.Post;
import com.mahmud.back_end.model.user.User;
import com.mahmud.back_end.exception.ResourceNotFoundException;
import com.mahmud.back_end.exception.UnauthorizedException;
import com.mahmud.back_end.repository.CommentRepository;
import com.mahmud.back_end.repository.PostRepository;
import com.mahmud.back_end.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Page<CommentDTO> getPostComments(Long postId, Pageable pageable) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        return commentRepository.findByPostAndParentIsNullOrderByCreatedAtDesc(post, pageable)
                .map(this::mapToDTO);
    }

    @Transactional
    public CommentDTO createComment(CommentCreateRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment parent = null;
        if (request.getParentId() != null) {
            parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(user)
                .post(post)
                .parent(parent)
                .build();

        return mapToDTO(commentRepository.save(comment));
    }

    @Transactional
    public CommentDTO updateComment(Long commentId, CommentUpdateRequest request, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setContent(request.getContent());
        return mapToDTO(commentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    private CommentDTO mapToDTO(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .user(UserDTO.builder()
                        .username(comment.getUser().getUsername())
                        .name(comment.getUser().getName())
                        .profilePicture(comment.getUser().getProfilePicture())
                        .build())
                .postId(comment.getPost().getId())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
} 