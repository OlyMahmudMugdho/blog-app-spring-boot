package com.mahmud.back_end.dto.post;

import com.mahmud.back_end.dto.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private Long id;
    private String title;
    private String content;
    private UserDTO author;
    private Set<String> tags;
    private String coverImage;
    private int viewCount;
    private int likesCount;
    private int commentsCount;
    private int bookmarksCount;
    private boolean isLiked;
    private boolean isBookmarked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 