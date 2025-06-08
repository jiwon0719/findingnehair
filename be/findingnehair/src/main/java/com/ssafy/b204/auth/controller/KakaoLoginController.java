package com.ssafy.b204.auth.controller;

import com.ssafy.b204.auth.service.KakaoService;
import com.ssafy.b204.auth.dto.KakaoUserInfoResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class KakaoLoginController {

    private final KakaoService kakaoService;

    // 카카오 로그인
    @GetMapping("/auth/login/kakao")
    public ResponseEntity<?> callback(@RequestParam("code") String code, HttpServletResponse response) {
        // 1. kakao 로그인 , 토큰 발급
        Map<String, String> tokens = kakaoService.getAccessToken(code);

        String accessToken = tokens.get("accessToken");
        String refreshToken = tokens.get("refreshToken");
        int refreshTokenExpiresIn = Integer.parseInt(tokens.get("refreshTokenExpireIn"));

        // 2. kakao 사용자 정보 요청
        KakaoUserInfoResponseDto userInfo = kakaoService.getUserInfo(accessToken);

        // 3. DB 회원 확인
        kakaoService.processUserLogin(userInfo, tokens);

        // 4. 로그인 처리
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(refreshTokenExpiresIn);
        response.addCookie(refreshTokenCookie);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("status", "success");
        responseBody.put("message", "로그인이 성공적으로 처리되었습니다.");

        return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
    }
}