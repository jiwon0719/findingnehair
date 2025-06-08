package com.ssafy.b204.repository;

import com.ssafy.b204.entity.Product;
import com.ssafy.b204.entity.ProductFeature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductFeatureRepository extends JpaRepository<ProductFeature, Integer> {
    List<ProductFeature> findByProduct(Product product);

    @Query("SELECT pf FROM ProductFeature pf JOIN FETCH pf.feature WHERE pf.product = :product")
    List<ProductFeature> findByProductWithFeature(@Param("product") Product product);

}
