package com.ssafy.b204.reply.dto;

import com.ssafy.b204.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.joda.time.DateTime;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor // 기본 생성자
@AllArgsConstructor // 모든 필드를 매개변수로 갖는 생성자
public class ReplyDto {

    public ReplyDto(int replyId , String replyContent , LocalDateTime createAt, int boardId , String userId){
        this.replyId = replyId;
        this.replyContent = replyContent;
        this.createAt = createAt;
        this.boardId = boardId;
        this.userId = userId;
    }

    private int replyId;
    private String replyContent;
    private LocalDateTime createAt;
    private int boardId;
    private String userId;
    private String userNickName;



}
