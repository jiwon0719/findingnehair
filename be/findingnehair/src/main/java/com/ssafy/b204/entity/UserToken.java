package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_token")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserToken {

    @Id
    private String id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "user_id")
//    @Comment("사용자 ID")
    private UserInfo userInfo;

    @Column(name = "accessToken", length = 100)
    @Comment("access 토큰")
    private String accessToken;

    @Column(name = "refreshToken", length = 100)
    @Comment("refresh 토큰")
    private String refreshToken;

    @Column(name = "at_expire_time")
    @Comment("access 만료 시간")
    private LocalDateTime atExpireTime;

    @Column(name = "re_expire_time")
    @Comment("refresh 만료 시간")
    private LocalDateTime reExpireTime;
}