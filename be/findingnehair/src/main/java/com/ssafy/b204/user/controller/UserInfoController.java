package com.ssafy.b204.user.controller;

import com.ssafy.b204.user.dto.UserInfoRequestDto;
import com.ssafy.b204.user.dto.UserInfoResponseDto;
import com.ssafy.b204.user.service.UserInfoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserInfoController {

    private final UserInfoService userInfoService;

    /**
     * 설문을 통해 사용자 정보를 저장합니다. (5개 항목)
     * @param request
     * @return
     */
    @PostMapping("/create")
    public ResponseEntity<Void> createUserInfo(HttpServletRequest request, @RequestBody UserInfoRequestDto userInfoRequestDto) {
        String userId = (String) request.getAttribute("kakaoId");
        userInfoRequestDto.setUserId(userId);
        userInfoService.createUserInfo(userInfoRequestDto);

        return ResponseEntity.ok().build();
    }

    /**
     * 설문을 통해 사용자 정보를 수정합니다. (5개 항목)
     * @param request
     * @param userInfoRequestDto
     * @return
     */
    @PutMapping("/update")
    public ResponseEntity<Void> updateUserInfo(HttpServletRequest request, @RequestBody UserInfoRequestDto userInfoRequestDto) {
        String userId = (String) request.getAttribute("kakaoId");
        userInfoRequestDto.setUserId(userId);
        userInfoService.updateUserInfo(userInfoRequestDto);

        return ResponseEntity.ok().build();
    }

    /**
     * 사용자 정보를 조회합니다. (5개 항목 포함)
     * @param request
     * @return
     */
    @GetMapping("/detail")
    public ResponseEntity<?> getUserInfoDetailById(HttpServletRequest request) {
        String userId = (String) request.getAttribute("kakaoId");
        Object result = userInfoService.getUserInfoDetailById(userId);

        if (result instanceof Object[]) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.ok(result);
        }
    }
}
