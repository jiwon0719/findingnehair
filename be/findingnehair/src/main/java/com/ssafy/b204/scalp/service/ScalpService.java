package com.ssafy.b204.scalp.service;

import com.ssafy.b204.mypage.dto.UserScalpDto;
import com.ssafy.b204.scalp.dto.ScalpDto;
import org.springframework.web.multipart.MultipartFile;

public interface ScalpService {


    /**
     * 추천하는 함수
     *
     */
    UserScalpDto analyzeScalp(MultipartFile img , String userId);
}
