package com.ssafy.b204.mypage.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserInfoResponseDto {
    private String userId;
    private String userNickname;
    private String userImgUrl;
}
