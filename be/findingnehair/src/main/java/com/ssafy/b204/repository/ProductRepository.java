package com.ssafy.b204.repository;


import com.ssafy.b204.entity.Product;
import com.ssafy.b204.entity.SubCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findBySubCategory(SubCategory subCategory);

    @Query( "SELECT p " +
            "FROM Product p " +
            "JOIN FETCH p.subCategory s " +
            "JOIN FETCH s.mainCategory " +
            "WHERE p.productId = :productId")
    Optional<Product> findByIdWithCategories(Long productId);


    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.subCategory " +
            "LEFT JOIN FETCH p.productFeatures pf " +
            "WHERE p IN (" +
            "SELECT fav.product " +
            "FROM ProductFavorite fav " +
            "WHERE fav.userInfo.userId = :userId)")
    List<Product> findFavoriteProductsByUserIdWithFetch(String userId);

    @EntityGraph(attributePaths = {"subCategory", "subCategory.mainCategory", "productFeatures", "productFeatures.feature"})
    Page<Product> findAll(Pageable pageable);

    @Query("SELECT p FROM Product p " +
            "JOIN p.subCategory s " +
            "JOIN s.mainCategory m " +
            "WHERE (:mainCategory IS NULL OR m.categoryName = :mainCategory) " +
            "AND (:subCategory IS NULL OR s.subCategoryName = :subCategory)")
    @EntityGraph(attributePaths = {"subCategory", "subCategory.mainCategory", "productFeatures", "productFeatures.feature"})
    Page<Product> findByCategoryAndFilter(@Param("mainCategory") String mainCategory,
                                          @Param("subCategory") String subCategory,
                                          Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.productFeatures pf " +
            "LEFT JOIN FETCH pf.feature")
    List<Product> findAllWithFeatures();

    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.subCategory sc " +
            "LEFT JOIN FETCH sc.mainCategory mc " +
            "LEFT JOIN FETCH p.productFeatures pf " +
            "LEFT JOIN FETCH pf.feature")
    List<Product> findAllWithFeaturesAndCategories();


}
