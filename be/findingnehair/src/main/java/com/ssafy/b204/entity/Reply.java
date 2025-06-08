package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "reply")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reply_id")
    @Comment("댓글 ID")
    private int replyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false) // 식별관계 특징 가져가기
    @OnDelete(action = OnDeleteAction.CASCADE) // 식별관계 특징 가져가기
    @Comment("게시판 ID")
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @Comment("사용자 ID")
    private UserInfo userInfo;

    @Column(name = "reply_content", length = 255)
    @Comment("댓글 내용")
    private String replyContent;

    @Column(name = "reply_create_at")
    @Comment("댓글 작성 시간")
    private LocalDateTime replyCreateAt;
}
