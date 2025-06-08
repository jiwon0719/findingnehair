package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;

import java.time.LocalDate;


@Entity
@Table(name = "user_info")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    @Id
    @Column(name = "user_id", length = 50)
    @Comment("사용자 ID")
    private String userId;

    @Column(name = "user_email", nullable = false, length = 30)
    @Comment("사용자 email")
    private String userEmail;

    @Column(name = "user_nickName", nullable = true, length = 30)
    @Comment("사용자 nickName")
    private String userNickname;

    @Column(name = "user_img_url", nullable = false)
    @Comment("사용자 이미지 경로")
    private String userImgUrl;

    @Column(name = "shampoo_usage_frequency", length = 50)
    @Comment("샴푸 사용 빈도")
    private Integer shampooUsageFrequency;

    @Column(name = "perm+frequency", length = 50)
    @Comment("펌 주기")
    private Integer permFrequency;

    @Column(name = "hair_dye_frequency", length = 50)
    @Comment("염색 주기")
    private Integer hairDyeFrequency;

    @Column(name = "gender")
    @Comment("성별")
    private Integer gender; // 0 : 남자, 1 : 여자

    @Column(name = "age_group")
    @Comment("연령대")
    private Integer ageGroup;
}
