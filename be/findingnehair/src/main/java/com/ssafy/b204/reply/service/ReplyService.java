package com.ssafy.b204.reply.service;

import com.ssafy.b204.reply.dto.ReplyDto;

import java.util.List;

public interface ReplyService {
    ReplyDto createReply(ReplyDto replyDto);

    ReplyDto updateReply(int replyId, ReplyDto replyDto);

    void deleteReply(String userId , int replyId);

    List<ReplyDto> getReplyList(int boardId);
}
