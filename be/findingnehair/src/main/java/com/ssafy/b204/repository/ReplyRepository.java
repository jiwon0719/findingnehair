package com.ssafy.b204.repository;

import com.ssafy.b204.entity.Reply;
import com.ssafy.b204.entity.UserInfo;
import com.ssafy.b204.reply.dto.ReplyDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {

    @Query("SELECT new com.ssafy.b204.reply.dto.ReplyDto(" +
            "r.replyId, r.replyContent, r.replyCreateAt, r.board.boardId, r.userInfo.userId, r.userInfo.userNickname) " +
            "FROM Reply r WHERE r.board.boardId = :boardId")
    List<ReplyDto> getReplyList(@Param("boardId") int boardId);


    void deleteAllByUserInfo(UserInfo userInfo);
}
