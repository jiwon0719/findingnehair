package com.ssafy.b204.repository;

import com.ssafy.b204.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserInfo, String> {

    // 사용자 ID로 조회 (user_id는 PK이므로 기본적으로 findById도 가능)
    Optional<UserInfo> findByUserId(String userId);

    // 사용자 이메일로 조회 (추가 쿼리 예시)
    Optional<UserInfo> findByUserEmail(String userEmail);

    // 닉네임으로 조회 (선택사항)
    Optional<UserInfo> findByUserNickname(String userNickname);
}