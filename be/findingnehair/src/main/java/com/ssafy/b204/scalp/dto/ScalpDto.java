package com.ssafy.b204.scalp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // 기본 생성자
@AllArgsConstructor // 모든 필드를 매개변수로 갖는 생성자
public class ScalpDto {

    private int scalpId;
    private String userId;
    private String scalpImgUrl;
    private String shampooUsageFrequency;   //샴푸 사용 빈도
    private String perm_frequency;          //펌 주기
    private String hair_dye_frequency;      //염색 주기


}
