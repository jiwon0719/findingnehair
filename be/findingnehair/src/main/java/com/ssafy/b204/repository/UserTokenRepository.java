package com.ssafy.b204.repository;

import com.ssafy.b204.entity.UserInfo;
import com.ssafy.b204.entity.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserTokenRepository extends JpaRepository<UserToken, UserInfo> {
    Optional<UserToken> findByUserInfo(UserInfo userInfo);
    Optional<UserToken> findByRefreshToken(String refreshToken);
}
