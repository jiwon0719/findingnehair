package com.ssafy.b204.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.b204.auth.service.KakaoService;
import com.ssafy.b204.global.filter.AuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class WebFilterConfig {

    private final KakaoService kakaoService;
    private final ObjectMapper objectMapper;

    @Bean
    public FilterRegistrationBean<AuthFilter> authFilter() {
        FilterRegistrationBean<AuthFilter> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(new AuthFilter(kakaoService, objectMapper));
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(1);

        registrationBean.addInitParameter("excludedPaths", "/auth/login/kakao,/api/public");

        return registrationBean;
    }
}
