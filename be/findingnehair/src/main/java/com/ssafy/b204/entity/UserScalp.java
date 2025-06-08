package com.ssafy.b204.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Comment;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_scalp")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserScalp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scalp_id")
    @Comment("두피 ID")
    private int scalpId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @Comment("사용자 ID")
    private UserInfo userInfo;

    @Column(name = "scalp_img_url", length = 100)
    @Comment("이미지 경로")
    private String scalpImgUrl;

    @Column(name = "scalp_diagnosis_date")
    @Comment("진단 날짜")
    private LocalDateTime scalpDiagnosisDate;

    @Column(name = "scalp_diagnosis_result", length = 255)
    @Comment("진단 결과")
    private String scalpDiagnosisResult;

    @Column(name = "micro_keratin")
    @Comment("미세각질")
    private int microKeratin;

    @Column(name = "excess_sebum")
    @Comment("피지과다")
    private int excessSebum;

    @Column(name = "follicular_erythema")
    @Comment("모낭사이홍반")
    private int follicularErythema;

    @Column(name = "follicular_inflammation_pustules")
    @Comment("모낭홍반농포")
    private int follicularInflammationPustules;

    @Column(name = "dandruff")
    @Comment("비듬")
    private int dandruff;

    @Column(name = "hair_loss")
    @Comment("탈모")
    private int hairLoss;
}
