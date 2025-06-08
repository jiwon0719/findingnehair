package com.ssafy.b204.board.dto;


import lombok.*;

import java.time.LocalDateTime;

@Data // @Getter, @Setter, @ToString, @EqualsAndHashCode를 모두 포함
@NoArgsConstructor // 기본 생성자
@AllArgsConstructor // 모든 필드를 매개변수로 갖는 생성자
public class BoardDto {

    public BoardDto(int boardId, LocalDateTime createAt, String title, String userId, String content) {
        this.boardId = boardId;
        this.createAt = createAt;
        this.title = title;
        this.userId = userId;
        this.content = content;
    }


    private  int boardId;
    private LocalDateTime createAt;
    private String title;
    private String userId;
    private String content;
    private String userNickName;
}
