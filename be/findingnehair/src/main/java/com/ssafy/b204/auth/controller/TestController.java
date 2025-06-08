package com.ssafy.b204.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/authenticated")
    public ResponseEntity<String> authenticatedEndpoint(HttpServletRequest request) {
        // 필터에서 설정한 속성 가져오기
        Object kakaoId = request.getAttribute("kakaoId");

        if (kakaoId != null) {
            return ResponseEntity.ok("인증 성공! 카카오 ID: " + kakaoId);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
        }
    }

    // 인증이 필요 없는 엔드포인트 (필터 제외 경로)
    @GetMapping("/public")
    public ResponseEntity<String> publicEndpoint() {
        return ResponseEntity.ok("누구나 접근 가능한 API입니다.");
    }
}