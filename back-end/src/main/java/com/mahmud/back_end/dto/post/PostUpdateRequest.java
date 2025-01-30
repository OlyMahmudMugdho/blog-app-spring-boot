package com.mahmud.back_end.dto.post;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateRequest {
    
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    private String content;

    private Set<String> tags;

    private String coverImage;

    private Boolean published;
} 