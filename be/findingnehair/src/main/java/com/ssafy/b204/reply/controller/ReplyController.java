package com.ssafy.b204.reply.controller;

import com.ssafy.b204.reply.dto.ReplyDto;
import com.ssafy.b204.reply.service.ReplyServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reply")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyServiceImpl replyService;


    /**
     * 댓글작성
     * @param request
     * @param replyDto
     * @return
     */
    @PostMapping("/create")
    public ResponseEntity<ReplyDto> createReply(HttpServletRequest request, @RequestBody ReplyDto replyDto){
        String userId = (String) request.getAttribute("kakaoId");
        replyDto.setUserId(userId);
        return ResponseEntity.ok(replyService.createReply(replyDto));
    }

    /**
     * 댓글 수정
     * @param request
     * @param replyId
     * @param replyDto
     * @return
     */
    @PutMapping("/update/{replyId}")
    public ResponseEntity<ReplyDto> updateReply(HttpServletRequest request, @PathVariable int replyId, @RequestBody ReplyDto replyDto){
        String userId = (String) request.getAttribute("kakaoId");
        replyDto.setUserId(userId);
        return ResponseEntity.ok(replyService.updateReply(replyId , replyDto));
    }

    /**
     * 댓글 삭제
     * @param request
     * @param replyId
     * @return
     */
    @DeleteMapping("/delete/{replyId}")
    public ResponseEntity<?> deleteReply(HttpServletRequest request, @PathVariable int replyId){
        String userId = (String) request.getAttribute("kakaoId");
        replyService.deleteReply(userId, replyId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 댓글 읽기
     * @param boardId
     * @return
     */
    @GetMapping("/list/{boardId}")
    public ResponseEntity<List<ReplyDto>> getReplyList(@PathVariable int boardId){
        return ResponseEntity.ok(replyService.getReplyList(boardId));
    }


}
