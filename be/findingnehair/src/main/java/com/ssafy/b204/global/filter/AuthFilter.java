package com.ssafy.b204.global.filter;

import com.ssafy.b204.auth.service.KakaoService;
import com.ssafy.b204.auth.dto.KakaoUserInfoResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.WebUtils;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


@Slf4j
@RequiredArgsConstructor
public class AuthFilter implements Filter {

    private final KakaoService kakaoService;
    private final ObjectMapper objectMapper;

    private List<String> excludedPaths;

    /*
    웹 컨테이너(톰캣)이 시작될 때 필터 최초 한 번 인스턴스 생성
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        log.info("---필터 인스턴스 초기화---");

        String excludedPathsParam = filterConfig.getInitParameter("excludedPaths");

        if (excludedPathsParam != null && !excludedPathsParam.isEmpty()) {
            excludedPaths = Arrays.asList(excludedPathsParam.split(","));
            log.info("제외 경로 설정: {}", excludedPaths);
        }
    }

    /*
    클라이언트 요청 시
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse res = (HttpServletResponse) servletResponse;

        String requestURI = req.getRequestURI();
        log.info("---Request(" + requestURI + ") 필터 시작---");

        res.setHeader("Access-Control-Allow-Origin", "https://www.findingnehair.site");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

        res.setHeader("Access-Control-Expose-Headers", "Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            log.info("OPTION METHOD RETURN");
            res.setStatus(HttpServletResponse.SC_OK); // ✅ 중요!

            return;
        }

        // 필터 제외 경로 확인
        if(isExcludedPath(requestURI)) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // 토큰 추출
        String accessToken = extractAccessToken(req);
        String refreshToken = extractRefreshToken(req);

        // 토큰 유무 확인
        if(accessToken == null && refreshToken == null) {
            // 토큰이 없는 경우
            res.setContentType("text/plain;charset=UTF-8");
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("토큰이 필요합니다.");
            return;
        }

        // 토큰 유효성 검증
        try {
            if(accessToken != null) {
                KakaoUserInfoResponseDto userInfo = kakaoService.getUserInfo(accessToken);

                // 엑세스 토큰 만료된 경우
                if(userInfo == null) {
                    // 리프레시 토큰 확인
                    if(refreshToken != null) {
                        log.info( "[Filter] 엑세스 토큰 만료, 리프레시 토큰으로 재발급 시도");
                        refreshToken(refreshToken, accessToken, res);
                        return;
                    } else {
                        // 리프레시 토큰도 없는 경우
                        res.setContentType("application/json;charset=UTF-8");
                        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        res.getWriter().write("{\"error\":\"인증 세션 만료\",\"action\":\"login\"}");
                        return;
                    }
                }

                // 사용자 정보 있는 경우(엑세스 토큰 유효한 경우)
                req.setAttribute("kakaoUserInfo", userInfo);
                req.setAttribute("kakaoId", userInfo.getId());

                log.info("[filter] 카카오 사용자 인증 성공 : id={}, 닉네임={}",
                        userInfo.getId(),
                        userInfo.getKakaoAccount().getProfile().getNickName());
                filterChain.doFilter(req, res);

            } else if(refreshToken != null) {
                // 엑세스 토큰 X, 리프레시 토큰 O
                refreshToken(refreshToken, accessToken, res);
            }
        } catch (WebClientResponseException e) {
            if(e.getStatusCode() == HttpStatus.UNAUTHORIZED && refreshToken != null) {
                log.info(" [Filter] 엑세스 토큰 만료, 리프레시 토큰으로 재발급 시도");
                refreshToken(refreshToken, accessToken, res);
            } else {
                handleTokenError(e, res);
            }
        } catch (Exception e) {
            log.error("토큰 검증 중 예외 발생: {}", e.getMessage(), e);
            res.setContentType("application/json;charset=UTF-8");
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            res.getWriter().write("{\"error\":\"서버 오류: " + e.getMessage() + "\"}");
        }
        log.info("---Response(" + requestURI + ") 필터---");
    }

    private void handleTokenError(WebClientResponseException e, HttpServletResponse res) throws IOException {
        log.error("카카오 토큰 검증 실패: 상태 코드={}, 메시지={}", e.getStatusCode(), e.getMessage());

        res.setContentType("application/json;charset=UTF-8");
        res.setStatus(e.getStatusCode() == HttpStatus.UNAUTHORIZED ?
                HttpServletResponse.SC_UNAUTHORIZED : HttpServletResponse.SC_FORBIDDEN);
        res.getWriter().write("{\"error\":\"카카오 토큰 검증 실패: " + e.getMessage() + "\"}");
    }


    private void refreshToken (String refreshToken,String accessToken, HttpServletResponse res) throws IOException {
        try {
            Map<String, String> tokens = kakaoService.getNewAccessToken(refreshToken, accessToken);

            res.setContentType("application/json;charset=UTF-8");
            res.setStatus(HttpServletResponse.SC_OK);
            res.getWriter().write(objectMapper.writeValueAsString(tokens));
            log.info(" [Filter] 엑세스 토큰 재발급 성공");
        } catch (Exception e) {
            // 리프레시 토큰도 만료된 경우
            log.error(" [Filter] 리프레시 토큰 처리 실패: {}", e.getMessage());
            try {
                kakaoService.logout(refreshToken);
                log.info(" [Filter] 사용자 로그아웃 처리");
            } catch(Exception e2) {
                log.error(" [Filter] 사용자 로그아웃 처리 중 에러 발생: {}", e2.getMessage());
            }

            res.setContentType("application/json;charset=UTF-8");
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("{\"error\":\"인증 세션 만료\",\"action\":\"logout\"}");
        }
    }

    // 리프레시 토큰 추출
    private String extractRefreshToken(HttpServletRequest req) {
        Cookie cookie = WebUtils.getCookie(req, "refresh_token");
        return cookie != null ? cookie.getValue() : null;
    }

    // 엑세스 토큰 추출
    private String extractAccessToken(HttpServletRequest req) {
        String bearerToken = req.getHeader("Authorization");
        if(bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // 토큰만 빼기
        }
        return null;
    }

    // 제외 경로 확인
    private boolean isExcludedPath(String requestURI) {
        boolean isExcluded = false;
        for (String path : excludedPaths) {
            if (requestURI.startsWith(path)) {
                isExcluded = true;
                break;
            }
        }
        return isExcluded;
    }




    /*
    필터 인스턴스가 제거될 때 실행되는 메서드, 종료하는 기능
     */
    @Override
    public void destroy() {
        log.info("---필터 인스턴스 종료---");
        Filter.super.destroy();
    }
}
