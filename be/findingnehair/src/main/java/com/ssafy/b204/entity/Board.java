package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;

import java.time.LocalDateTime;

@Entity
@Table(name = "board")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    @Comment("게시판ID")
    private int boardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @Comment("사용자ID")
    private UserInfo userInfo;

    @Column(name = "title", length = 30)
    @Comment("게시판 제목")
    private String title;

    @Column(name = "content")
    @Comment("게시판 내용")
    private String content;

    @Column(name = "create_at")
    @Comment("작성 시간")
    private LocalDateTime createAt;
}
