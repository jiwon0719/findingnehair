package com.ssafy.b204.mypage.controller;

import com.ssafy.b204.mypage.dto.BoardsResponseDto;
import com.ssafy.b204.mypage.dto.UserInfoResponseDto;
import com.ssafy.b204.mypage.dto.UserScalpDto;
import com.ssafy.b204.mypage.service.MypageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
public class MypageController {

    private final MypageService mypageService;

    // 닉네임 수정
    @PatchMapping("/update")
    public ResponseEntity<?> updateNickname(
            HttpServletRequest request,
            @RequestParam String newNickname) {
        String userId = (String) request.getAttribute("kakaoId");
        mypageService.updateNickname(userId, newNickname);
        return ResponseEntity.ok("닉네임이 성공적으로 변경되었습니다.");
    }

    // 회원 탈퇴
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(HttpServletRequest request) {
        String userId = (String) request.getAttribute("kakaoId");
        mypageService.deleteUser(userId);
        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }

    // 두피 상태 측정 이력 목록 보기
    @GetMapping("/scalp-history")
    public ResponseEntity<Page<UserScalpDto>> getScalpHistory(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String userId = (String) request.getAttribute("kakaoId");
        Page<UserScalpDto> history = mypageService.getScalpHistory(userId, page, size);
        return ResponseEntity.ok(history);
    }

    // 사용자 정보 조회
    @GetMapping
    public ResponseEntity<UserInfoResponseDto> getUserInfo(HttpServletRequest request) {
        String userId = (String) request.getAttribute("kakaoId");
        return mypageService.getUserInfo(userId);
    }

    // 내가 작성한 게시글 리스트 조회
    @GetMapping("/boards")
    public ResponseEntity<Page<BoardsResponseDto>> getUserBoards(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String userId = (String) request.getAttribute("kakaoId");
        Page<BoardsResponseDto> boards = mypageService.getUserBoards(userId, page, size);
        return ResponseEntity.ok(boards);
    }
}
