package com.mahmud.back_end.repository;

import com.mahmud.back_end.model.comment.Comment;
import com.mahmud.back_end.model.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByPostOrderByCreatedAtDesc(Post post, Pageable pageable);
    Page<Comment> findByPostAndParentIsNullOrderByCreatedAtDesc(Post post, Pageable pageable);
    void deleteByPost(Post post);
} 