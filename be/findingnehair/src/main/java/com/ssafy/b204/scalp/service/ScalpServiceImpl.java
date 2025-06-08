package com.ssafy.b204.scalp.service;

import com.ssafy.b204.entity.UserInfo;
import com.ssafy.b204.entity.UserScalp;
import com.ssafy.b204.global.api.ApiClient;
import com.ssafy.b204.mypage.dto.UserScalpDto;
import com.ssafy.b204.repository.UserRepository;
import com.ssafy.b204.repository.UserScalpRepository;
import com.ssafy.b204.s3.S3ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScalpServiceImpl implements ScalpService{

    private final S3ImageService s3ImageService;
    private final UserRepository userRepository;
    private final UserScalpRepository userScalpRepository;
    private final ApiClient apiClient;

    /**
     * 이미지 전달하고 가져오는 코드
     * @param img
     * @param userId
     * @return
     */
    @Override
    public UserScalpDto analyzeScalp(MultipartFile img, String userId) {
        // 1. 사용자 조회
        UserInfo user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        // 2. presigned url을 위한 사전 처리
        String saveImgUrl = s3ImageService.upload(img , userId);
        String imageName = saveImgUrl.substring(saveImgUrl.lastIndexOf("/") + 1);
        String presignedUrl = s3ImageService.generatePresignedUrl(userId , imageName);

        log.info("SAVE URL : " + saveImgUrl);
        log.info("PRESIGNED URL : " + presignedUrl);

        // 3. AI 서버 호출
        Map<String , Object > resultMap = apiClient.sendImage(img);

        // 4. 실패한 경우
        if (resultMap == null || resultMap.get("final_diagnosis") == null || resultMap.get("diagnosis") == null) {
            s3ImageService.deleteImageFromS3(saveImgUrl);
            log.warn("이미지 분석 실패 - 결과 없음");
            throw new IllegalArgumentException("잘못된 이미지입니다.");
        }

        // 5. 분석 성공 시 저장
        Map<String, Object> scalpResultMap = (Map<String, Object>) resultMap.get("diagnosis");
        String scalpResult = (String) resultMap.get("final_diagnosis");

        UserScalp userScalp = UserScalp.builder()
                .userInfo(user)
                .scalpImgUrl(saveImgUrl)
                .scalpDiagnosisDate(LocalDateTime.now())
                .scalpDiagnosisResult(scalpResult)
                .microKeratin((Integer) scalpResultMap.get("micro_keratin"))
                .excessSebum((Integer) scalpResultMap.get("excess_sebum"))
                .follicularErythema((Integer) scalpResultMap.get("follicular_erythema"))
                .follicularInflammationPustules((Integer) scalpResultMap.get("follicular_inflammation_pustules"))
                .dandruff((Integer) scalpResultMap.get("dandruff"))
                .hairLoss((Integer) scalpResultMap.get("hair_loss"))
                .build();

        userScalpRepository.save(userScalp);

        return new UserScalpDto(
                presignedUrl,
                userScalp.getScalpDiagnosisDate(),
                userScalp.getScalpDiagnosisResult(),
                userScalp.getMicroKeratin(),
                userScalp.getExcessSebum(),
                userScalp.getFollicularErythema(),
                userScalp.getFollicularInflammationPustules(),
                userScalp.getDandruff(),
                userScalp.getHairLoss()
        );
    }
}
