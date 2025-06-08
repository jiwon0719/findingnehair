package com.ssafy.b204.repository;

import com.ssafy.b204.entity.TokenBlackList;
import com.ssafy.b204.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenBlackListRepository extends JpaRepository<TokenBlackList, Integer> {
    boolean existsByToken(String token);

    void deleteAllByUserInfo(UserInfo userInfo);
}
