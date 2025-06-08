package com.ssafy.b204.repository;

import com.ssafy.b204.entity.MainCategory;
import com.ssafy.b204.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Integer> {
    Optional<SubCategory> findBySubCategoryNameAndMainCategory(String subName, MainCategory mainCategory);
}
