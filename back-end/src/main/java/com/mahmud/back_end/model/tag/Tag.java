package com.mahmud.back_end.model.tag;

import com.mahmud.back_end.model.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag extends BaseEntity {

    @NotBlank
    @Size(min = 2, max = 50)
    @Column(unique = true)
    private String name;

    @Size(max = 200)
    private String description;

    @Builder.Default
    private int usageCount = 0;
} 