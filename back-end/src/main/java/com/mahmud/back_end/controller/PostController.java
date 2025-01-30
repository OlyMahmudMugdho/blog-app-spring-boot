package com.mahmud.back_end.controller;

import com.mahmud.back_end.dto.post.PostCreateRequest;
import com.mahmud.back_end.dto.post.PostDTO;
import com.mahmud.back_end.dto.post.PostUpdateRequest;
import com.mahmud.back_end.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<Page<PostDTO>> getAllPosts(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<PostDTO>> getFeed(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(postService.getFeed(pageable));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<Page<PostDTO>> getPostsByUser(
            @PathVariable String username,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(postService.getPostsByUser(username, pageable));
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<Page<PostDTO>> getPostsByTag(
            @PathVariable String tag,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(postService.getPostsByTag(tag, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostDTO>> searchPosts(
            @RequestParam String query,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(postService.searchPosts(query, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    @PostMapping
    public ResponseEntity<PostDTO> createPost(@Valid @RequestBody PostCreateRequest request) {
        return ResponseEntity.ok(postService.createPost(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostUpdateRequest request
    ) {
        return ResponseEntity.ok(postService.updatePost(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<PostDTO> likePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.likePost(id));
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<PostDTO> unlikePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.unlikePost(id));
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<PostDTO> bookmarkPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.bookmarkPost(id));
    }

    @DeleteMapping("/{id}/bookmark")
    public ResponseEntity<PostDTO> removeBookmark(@PathVariable Long id) {
        return ResponseEntity.ok(postService.removeBookmark(id));
    }
} 