package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;

import java.time.LocalDateTime;

@Entity
@Table(name = "token_blackList")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenBlackList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bl_id")
    private int blId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @Comment("사용자 ID")
    private UserInfo userInfo;

    @Column(name = "reason")
    @Comment("블랙리스트 사유")
    // 1: 토큰 갱신으로 인한 블랙리스트 추가
    // 2: 로그아웃으로 인한 블랙리스트 추가
    private int reason;

    @Column(name = "create_at")
    @Comment("생성 시간")
    private LocalDateTime createAt;

    @Column(name = "token", nullable = false, length = 100)
    @Comment("access_token")
    private String token;
}
