package com.mahmud.back_end.model.reaction;

import com.mahmud.back_end.model.common.BaseEntity;
import com.mahmud.back_end.model.post.Post;
import com.mahmud.back_end.model.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reactions",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "post_id", "type"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReactionType type;
} 