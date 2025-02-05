package com.mahmud.back_end.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentCreateRequest {
    @NotBlank(message = "Comment content is required")
    private String content;

    @NotNull(message = "Post ID is required")
    private Long postId;

    private Long parentId;
} 