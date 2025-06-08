package com.ssafy.b204.auth.service;

import com.ssafy.b204.entity.UserInfo;
import com.ssafy.b204.entity.UserToken;
import com.ssafy.b204.repository.TokenBlackListRepository;
import com.ssafy.b204.repository.UserInfoRepository;
import com.ssafy.b204.repository.UserTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenService {

    private final UserTokenRepository userTokenRepository;
    private final TokenBlackListRepository tokenBlackListRepository;
    private final UserInfoRepository userInfoRepository;

    /*
    토큰 저장 및 갱신 - 로그인 시 호출
     */
    @Transactional
    public void saveUserToken(String userId, Map<String, String> tokens) {
        String accessToken = tokens.get("accessToken");
        String refreshToken = tokens.get("refreshToken");
        int accessExpiresIn = Integer.parseInt(tokens.get("expiresIn"));
        int refreshExpiresIn = Integer.parseInt(tokens.get("refreshTokenExpireIn"));

        UserInfo userInfo = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없음: " + userId));

        Optional<UserToken> existingToken = userTokenRepository.findByUserInfo(userInfo);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime accessExpireTime = now.plusSeconds(accessExpiresIn);
        LocalDateTime refreshExpireTime = now.plusSeconds(refreshExpiresIn);

        if (existingToken.isPresent()) {
            UserToken userToken = existingToken.get();
            userToken.setAccessToken(accessToken);
            userToken.setRefreshToken(refreshToken);
            userToken.setAtExpireTime(accessExpireTime);
            userToken.setReExpireTime(refreshExpireTime);
            userTokenRepository.save(userToken);
            log.info(" [Token Service] 사용자 {} 토큰 갱신", userId);
        } else {
            UserToken newToken = new UserToken();
            newToken.setUserInfo(userInfo);
            newToken.setAccessToken(accessToken);
            newToken.setRefreshToken(refreshToken);
            newToken.setAtExpireTime(accessExpireTime);
            newToken.setReExpireTime(refreshExpireTime);
            userTokenRepository.save(newToken);
            log.info(" [Token Service] 사용자 {} 토큰 저장", userId);
        }
    }

    /**
     * 리프레시 토큰으로 사용자 ID 찾기 - 토큰 갱신 시 사용자 검증 목적
     */
    public Optional<String> findUserIdByRefreshToken(String refreshToken) {
        Optional<UserToken> userTokenOptional = userTokenRepository.findByRefreshToken(refreshToken);

        if(userTokenOptional.isPresent()) {
            UserToken userToken = userTokenOptional.get();
            UserInfo userInfo = userToken.getUserInfo();
            String userId = userInfo.getUserId();
            return Optional.of(userId);
        } else {
            return Optional.empty();
        }

    }

    /**
     * 토큰이 블랙리스트에 있는지 확인 - 모든 토큰 검증 시 호출
     */
    public boolean isTokenBlacklisted(String token) {
        return tokenBlackListRepository.existsByToken(token);
    }

}
