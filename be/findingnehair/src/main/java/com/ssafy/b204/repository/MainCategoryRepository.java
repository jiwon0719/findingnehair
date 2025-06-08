package com.ssafy.b204.repository;

import com.ssafy.b204.entity.MainCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MainCategoryRepository extends JpaRepository<MainCategory, Integer> {
    Optional<MainCategory> findByCategoryName(String categoryName);
}
