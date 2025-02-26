package com.mahmud.back_end.dto.comment;

import com.mahmud.back_end.dto.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
    private Long id;
    private String content;
    private UserDTO user;
    private Long postId;
    private Long parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 