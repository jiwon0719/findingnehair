package com.ssafy.b204.mypage.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BoardsResponseDto {
    private int boardId;
    private String title;
    private String content;
    private LocalDateTime createAt;

}
