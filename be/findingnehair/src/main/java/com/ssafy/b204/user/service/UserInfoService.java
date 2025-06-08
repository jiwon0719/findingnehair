package com.ssafy.b204.user.service;

import com.ssafy.b204.entity.UserInfo;
import com.ssafy.b204.global.exception.UserNotFoundException;
import com.ssafy.b204.repository.UserRepository;
import com.ssafy.b204.user.dto.UserInfoRequestDto;
import com.ssafy.b204.user.dto.UserInfoResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserInfoService {

    private final UserRepository userRepository;

    /**
     * 설문을 통해 사용자 정보를 저장합니다. (5개 항목)
     * @param userInfoRequestDto
     */
    @Transactional
    public void createUserInfo(UserInfoRequestDto userInfoRequestDto) {
        UserInfo user = userRepository.findByUserId(userInfoRequestDto.getUserId())
                .orElseThrow(() -> new UserNotFoundException(userInfoRequestDto.getUserId()));

        user.setShampooUsageFrequency(userInfoRequestDto.getShampooUsageFrequency());
        user.setPermFrequency(userInfoRequestDto.getPermFrequency());
        user.setHairDyeFrequency(userInfoRequestDto.getHairDyeFrequency());
        user.setGender(userInfoRequestDto.getGender());
        user.setAgeGroup(userInfoRequestDto.getAgeGroup());

        userRepository.save(user);
    }

    /**
     * 설문을 통해 사용자 정보를 수정합니다. (5개 항목)
     * @param userInfoRequestDto
     */
    @Transactional
    public void updateUserInfo(UserInfoRequestDto userInfoRequestDto) {
        UserInfo user = userRepository.findByUserId(userInfoRequestDto.getUserId())
                .orElseThrow(() -> new UserNotFoundException(userInfoRequestDto.getUserId()));

        user.setShampooUsageFrequency(userInfoRequestDto.getShampooUsageFrequency());
        user.setPermFrequency(userInfoRequestDto.getPermFrequency());
        user.setHairDyeFrequency(userInfoRequestDto.getHairDyeFrequency());
        user.setGender(userInfoRequestDto.getGender());
        user.setAgeGroup(userInfoRequestDto.getAgeGroup());

        userRepository.save(user);
    }

    /**
     * 사용자 정보를 반환합니다(5개 정보 포함)
     * @param userId
     * @return
     */
    public Object getUserInfoDetailById(String userId) {
        UserInfo user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // 모든 필드가 null인지 확인
        boolean allFieldsNull = user.getShampooUsageFrequency() == null &&
                user.getPermFrequency() == null &&
                user.getHairDyeFrequency() == null &&
                user.getGender() == null &&
                user.getAgeGroup() == null;

        // 모든 필드가 null이면 빈 배열 반환
        if (allFieldsNull) {
            return new Object[0]; // 빈 배열 반환
        }

        // 하나라도 값이 있으면 DTO 반환
        UserInfoResponseDto dto = UserInfoResponseDto.builder()
                .userId(user.getUserId())
                .shampooUsageFrequency(user.getShampooUsageFrequency() != null ? user.getShampooUsageFrequency() : 0)
                .permFrequency(user.getPermFrequency() != null ? user.getPermFrequency() : 0)
                .hairDyeFrequency(user.getHairDyeFrequency() != null ? user.getHairDyeFrequency() : 0)
                .gender(user.getGender() != null ? user.getGender() : 0)
                .ageGroup(user.getAgeGroup() != null ? user.getAgeGroup() : 0)
                .build();

        return dto;
    }
}
