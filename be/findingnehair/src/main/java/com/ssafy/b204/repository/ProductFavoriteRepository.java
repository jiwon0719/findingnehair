package com.ssafy.b204.repository;

import com.ssafy.b204.entity.ProductFavorite;
import com.ssafy.b204.entity.ProductFavoriteId;
import com.ssafy.b204.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductFavoriteRepository extends JpaRepository<ProductFavorite, ProductFavoriteId> {
    void deleteAllByUserInfo(UserInfo userInfo);
}
