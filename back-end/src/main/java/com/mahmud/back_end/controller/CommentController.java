package com.mahmud.back_end.controller;

import com.mahmud.back_end.dto.comment.CommentCreateRequest;
import com.mahmud.back_end.dto.comment.CommentDTO;
import com.mahmud.back_end.dto.comment.CommentUpdateRequest;
import com.mahmud.back_end.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/post/{postId}")
    public ResponseEntity<Page<CommentDTO>> getPostComments(
            @PathVariable Long postId,
            Pageable pageable) {
        return ResponseEntity.ok(commentService.getPostComments(postId, pageable));
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        request.setPostId(postId);
        return ResponseEntity.ok(commentService.createComment(request, userDetails.getUsername()));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(commentService.updateComment(commentId, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        commentService.deleteComment(commentId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
} 