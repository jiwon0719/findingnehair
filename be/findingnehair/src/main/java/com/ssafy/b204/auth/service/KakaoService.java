package com.ssafy.b204.auth.service;

import com.ssafy.b204.auth.dto.KakaoTokenResponseDto;
import com.ssafy.b204.auth.dto.KakaoUserInfoResponseDto;
import com.ssafy.b204.entity.TokenBlackList;
import com.ssafy.b204.entity.UserInfo;
import com.ssafy.b204.entity.UserToken;
import com.ssafy.b204.repository.TokenBlackListRepository;
import com.ssafy.b204.repository.UserInfoRepository;
import com.ssafy.b204.repository.UserTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpHeaders;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoService {

    @Value("${spring.kakao.auth.client}")
    private String clientId;

    @Value("${spring.kakao.auth.redirect}")
    private String redirectUri;

    private final String KAUTH_TOKEN_URL_HOST = "https://kauth.kakao.com";
    private final String KAUTH_USER_URL_HOST = "https://kapi.kakao.com";
    private final UserInfoRepository userInfoRepository;
    private final UserTokenRepository userTokenRepository;
    private final TokenBlackListRepository tokenBlackListRepository;
    private final TokenService tokenService;


    /**
     * kakao 관련 토큰 발급받는 함수
     * @param code
     * @return
     */
    // 토큰 발급
    public Map<String, String> getAccessToken (String code) {
        log.info("Received authorization code: {}", code);

        log.info("clientId: " +  clientId);
        log.info("redirectUri" + redirectUri);

        KakaoTokenResponseDto kakaoTokenResponseDto = WebClient.create(KAUTH_TOKEN_URL_HOST).post()
                .uri("/oauth/token")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .body(BodyInserters.fromFormData("grant_type", "authorization_code")
                        .with("client_id", clientId)
                        .with("redirect_uri", redirectUri)
                        .with("code", code))
                .retrieve()
                .bodyToMono(KakaoTokenResponseDto.class)
                .block();

        log.info(" [Kakao Service] Access Token ------> {}", kakaoTokenResponseDto.getAccessToken());
        log.info(" [Kakao Service] Refresh Token ------> {}", kakaoTokenResponseDto.getRefreshToken());

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", kakaoTokenResponseDto.getAccessToken());
        tokens.put("refreshToken", kakaoTokenResponseDto.getRefreshToken());
        tokens.put("refreshTokenExpireIn", String.valueOf(kakaoTokenResponseDto.getRefreshTokenExpireIn()));
        tokens.put("expiresIn", String.valueOf(kakaoTokenResponseDto.getExpiresIn()));

        return tokens;
    }


    // 리프레시 토큰으로 새 엑세스 토큰 발급
    public Map<String, String> getNewAccessToken (String refreshToken, String accessToken) {
        log.info(" [Kakao Service] 리프레시 토큰으로 새 엑세스 토큰 발급");

        String userId = tokenService.findUserIdByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("리프레시 토큰으로 해당하는 사용자를 찾을 수 없음"));

        // 블랙리스트 확인
        if(tokenService.isTokenBlacklisted(refreshToken)) {
            throw new RuntimeException("무효화된 리프레시 토큰입니다.");
        }

        KakaoTokenResponseDto refreshKaKaoTokenResponseDto = WebClient.create(KAUTH_TOKEN_URL_HOST).post()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .path("/oauth/token")
                        .build(true))
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .body(BodyInserters.fromFormData("grant_type", "refresh_token")
                        .with("client_id", clientId)
                        .with("refresh_token", refreshToken))
                .retrieve()
                .bodyToMono(KakaoTokenResponseDto.class)
                .block();

        log.info(" [Kakao Service] New Access Token ------> {}", refreshKaKaoTokenResponseDto.getAccessToken());

        // 리프레시 토큰이 갱신된 경우(카카오는 필요시 리프레시 토큰도 새로 발급해줌)
        if(refreshKaKaoTokenResponseDto.getRefreshToken() != null && !refreshKaKaoTokenResponseDto.getRefreshToken().isEmpty()) {
            log.info(" [Kakao Service] New Refresh Token------> {}", refreshKaKaoTokenResponseDto.getRefreshToken());
        }

        // 기존 엑세스 토큰 블랙리스트 저장
        if (accessToken != null && !accessToken.isEmpty()) {
            TokenBlackList tokenBlackList = new TokenBlackList();
            UserInfo userInfo = userInfoRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없음: " + userId));
            tokenBlackList.setUserInfo(userInfo);
            tokenBlackList.setToken(accessToken);
            tokenBlackList.setReason(1); // 1: 토큰 갱신으로 인한 블랙리스트 추가
            tokenBlackList.setCreateAt(LocalDateTime.now());
            tokenBlackListRepository.save(tokenBlackList);
            log.info(" [Kakao Service] 기존 엑세스 토큰 블랙리스트 추가: {}", accessToken);
        }

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", refreshKaKaoTokenResponseDto.getAccessToken());

        if(refreshKaKaoTokenResponseDto.getRefreshToken() != null && !refreshKaKaoTokenResponseDto.getRefreshToken().isEmpty()) {
            tokens.put("refreshToken", refreshKaKaoTokenResponseDto.getRefreshToken());
            tokens.put("refreshTokenExpireIn", String.valueOf(refreshKaKaoTokenResponseDto.getRefreshTokenExpireIn()));
        }

        return tokens;
    }


    // 사용자 정보 받기
    public KakaoUserInfoResponseDto getUserInfo (String accessToken) {

        KakaoUserInfoResponseDto userInfo = WebClient.create(KAUTH_USER_URL_HOST).get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .path("/v2/user/me")
                        .build(true))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .retrieve()
                .bodyToMono(KakaoUserInfoResponseDto.class)
                .block();
        log.info(" [Kakao Service] Auth ID ---> {} ", userInfo.getId());
        log.info(" [Kakao Service] NickName ---> {} ", userInfo.getKakaoAccount().getProfile().getNickName());
        log.info(" [Kakao Service] ProfileImageUrl ---> {} ", userInfo.getKakaoAccount().getProfile().getProfileImageUrl());

        return userInfo;
    }


    // DB 회원 확인
    @Transactional
    public void processUserLogin(KakaoUserInfoResponseDto userInfo, Map<String, String> tokens) {
        String userId = String.valueOf(userInfo.getId());
        boolean isExistUser = userInfoRepository.existsById(String.valueOf(userInfo.getId()));

        if(isExistUser) {
            // 기존 회원일 경우
            log.info(" [Kakao Service] 기존 회원 로그인 : {}", userInfo.kakaoAccount.profile.nickName);
        } else {
            // 신규 회원일 경우
            UserInfo newUser = new UserInfo();
            newUser.setUserId(String.valueOf(userInfo.getId()));
            newUser.setUserEmail(userInfo.kakaoAccount.getEmail());
            newUser.setUserNickname(userInfo.kakaoAccount.profile.nickName);
            newUser.setUserImgUrl(userInfo.kakaoAccount.profile.profileImageUrl);

            userInfoRepository.save(newUser);
        }

        tokenService.saveUserToken(userId, tokens);
    }


    // 로그아웃
    public void logout(String refreshToken) {
        String userId = tokenService.findUserIdByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("리프래시 토큰으로 사용자 ID 찾을 수 없음"));

        UserInfo userInfo = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자 ID로 올바른 사용자 정보를 찾을 수 없음"));

        Optional<UserToken> userTokenOptional = userTokenRepository.findByUserInfo(userInfo);

        // 만료된 토큰 블랙리스트 추가
        if(userTokenOptional.isPresent()) {
            UserToken userToken = userTokenOptional.get();

            if(userToken.getAccessToken() != null && !userToken.getAccessToken().isEmpty()) {
                TokenBlackList accesstokenBlackList = new TokenBlackList();
                accesstokenBlackList.setUserInfo(userInfo);
                accesstokenBlackList.setToken(userToken.getAccessToken());
                accesstokenBlackList.setReason(2); // 2: 로그아웃으로 인한 블랙리스트 추가
                accesstokenBlackList.setCreateAt(LocalDateTime.now());
                tokenBlackListRepository.save(accesstokenBlackList);
            }

            TokenBlackList refreshtokenBlackList = new TokenBlackList();
            refreshtokenBlackList.setUserInfo(userInfo);
            refreshtokenBlackList.setToken(userToken.getRefreshToken());
            refreshtokenBlackList.setReason(2);
            refreshtokenBlackList.setCreateAt(LocalDateTime.now());
            tokenBlackListRepository.save(refreshtokenBlackList);

            // DB 토큰 정보 삭제
            userTokenRepository.delete(userToken);

            log.info(" [Kakao Service] 사용자 {} 로그아웃 처리 완료 :", userInfo.getUserNickname());
        }
    }
}
