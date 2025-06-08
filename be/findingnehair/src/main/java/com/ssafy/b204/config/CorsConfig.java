package com.ssafy.b204.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // 모든 경로에 대해 CORS 설정 적용
                        .allowedOrigins("https://www.findingnehair.site", "https://dev.www.findingnehair.site")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // 허용할 HTTP 메서드
                        .allowedHeaders("*") // 모든 헤더 허용
                        .exposedHeaders("Authorization")
                        .allowCredentials(true); // 쿠키 포함 여부
            }
        };
    }
}
