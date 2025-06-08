package com.ssafy.b204.scalp.controller;

import com.ssafy.b204.entity.Product;
import com.ssafy.b204.mypage.dto.UserScalpDto;
import com.ssafy.b204.scalp.service.ScalpServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/scalp")
@RequiredArgsConstructor
public class ScalpController {

    private final ScalpServiceImpl scalpService;

    /**
     * 이미지 업로드 및 두피 검사
     * @param request
     * @param image
     * @return
     */
    @PostMapping("/upload")
    public ResponseEntity<?> analyzeScalp(HttpServletRequest request,@RequestPart("image") MultipartFile image){
        String userId = (String) request.getAttribute("kakaoId");

        try {
            UserScalpDto dto = scalpService.analyzeScalp(image , userId);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }

    }
}
