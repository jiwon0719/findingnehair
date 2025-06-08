package com.ssafy.b204.reply.service;

import com.ssafy.b204.entity.Board;
import com.ssafy.b204.entity.Reply;
import com.ssafy.b204.entity.UserInfo;
import com.ssafy.b204.reply.dto.ReplyDto;
import com.ssafy.b204.repository.BoardRepository;
import com.ssafy.b204.repository.ReplyRepository;
import com.ssafy.b204.repository.UserInfoRepository;
import com.ssafy.b204.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReplyServiceImpl implements ReplyService{

    private final ReplyRepository replyRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    /**
     * 댓글 작성
     * @param replyDto
     * @return
     */
    @Override
    public ReplyDto createReply(ReplyDto replyDto) {

        UserInfo user = userRepository.findByUserId(replyDto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        Reply reply = Reply.builder()
                .board(Board.builder().boardId(replyDto.getBoardId()).build())
                .replyContent(replyDto.getReplyContent())
                .userInfo(user)
                .replyCreateAt(LocalDateTime.now())
                .build();

        Reply saved = replyRepository.save(reply);

        return new ReplyDto(
                saved.getReplyId(),
                saved.getReplyContent(),
                saved.getReplyCreateAt(),
                saved.getBoard().getBoardId(),
                saved.getUserInfo().getUserId()
        );
    }

    /**
     * 댓글 수정
     * @param replyDto
     * @return
     */
    @Override
    public ReplyDto updateReply(int replyId , ReplyDto replyDto) {
        Board board = boardRepository.findById(replyDto.getBoardId())
                .orElseThrow(() -> new RuntimeException("해당 게시글이 존재하지 않습니다."));

        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("댓글이 존재하지 않습니다."));

        String writed = reply.getUserInfo().getUserId();
        if (!writed.equals(replyDto.getUserId())) {
            throw new RuntimeException("수정할 수 있는 사용자가 아닙니다.");
        }

        // 4. 댓글 내용 및 게시글 수정
        reply.setReplyContent(replyDto.getReplyContent());

        // 5. 저장
        Reply saved = replyRepository.save(reply);

        // 6. 결과 DTO 반환
        return new ReplyDto(
                saved.getReplyId(),
                saved.getReplyContent(),
                saved.getReplyCreateAt(),
                saved.getBoard().getBoardId(),
                saved.getUserInfo().getUserId()
        );
    }

    /**
     * 댓글 삭제
     * @param userId
     * @param replyId
     */
    @Override
    public void deleteReply(String userId , int replyId) {

        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        // 작성자를 검사해서 맞는지 확인한다.
        String writed = reply.getUserInfo().getUserId();
        if(!writed.equals(userId)){
            throw new RuntimeException("삭제할 수 있는 사용자가 아닙니다.");
        }

        replyRepository.delete(reply);
    }

    /**
     * 게시글에 대한 댓글 가져오기
     * @param boardId
     * @return
     */
    @Override
    public List<ReplyDto> getReplyList(int boardId) {
        return replyRepository.getReplyList(boardId);
    }
}
