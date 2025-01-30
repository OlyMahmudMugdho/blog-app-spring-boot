package com.mahmud.back_end.repository;

import com.mahmud.back_end.model.post.Post;
import com.mahmud.back_end.model.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByPublishedTrue(Pageable pageable);
    Page<Post> findByAuthor(User author, Pageable pageable);
    Page<Post> findByAuthorAndPublishedTrue(User author, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.published = true AND :tag MEMBER OF p.tags")
    Page<Post> findByTag(String tag, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.published = true AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Post> searchPosts(String query, Pageable pageable);
    
    Page<Post> findByLikes(User user, Pageable pageable);
    Page<Post> findByBookmarks(User user, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.author IN :following AND p.published = true")
    Page<Post> findByFollowing(List<User> following, Pageable pageable);
} 