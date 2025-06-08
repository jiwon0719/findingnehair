package com.ssafy.b204.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class UserScalpDto {
    private String scalpImgUrl;
    private LocalDateTime scalpDiagnosisDate;
    private String scalpDiagnosisResult;
    private int microKeratin;
    private int excessSebum;
    private int follicularErythema;
    private int follicularInflammationPustules;
    private int dandruff;
    private int hairLoss;
}