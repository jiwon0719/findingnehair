package com.ssafy.b204.repository;

import com.ssafy.b204.entity.UserInfo;
import com.ssafy.b204.entity.UserScalp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserScalpRepository extends JpaRepository<UserScalp, Long> {
    Page<UserScalp> findAllByUserInfo(UserInfo userInfo, Pageable pageable);

    void deleteAllByUserInfo(UserInfo userInfo);
}
