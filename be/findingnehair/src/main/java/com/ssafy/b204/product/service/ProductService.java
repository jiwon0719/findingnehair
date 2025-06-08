package com.ssafy.b204.product.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.b204.entity.*;
import com.ssafy.b204.product.dto.*;
import com.ssafy.b204.recommend.service.ClusteringService;
import com.ssafy.b204.repository.ProductRepository;
import com.ssafy.b204.repository.UserRepository;
import com.sun.tools.javac.Main;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ClusteringService clusteringService;
    private final UserRepository userRepository;

    // 전체 상품 리스트 조회(페이지네이션)
    public Page<ProductDto> getProductByPage(String mainCategory, String subCategory, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
//        Page<Product> products = productRepository.findAll(pageable);
        Page<Product> products = productRepository.findByCategoryAndFilter(mainCategory, subCategory, pageable);

        Page<ProductDto> productDtos = products.map(product ->  {

            SubCategory subCat = product.getSubCategory();
            MainCategory mainCat = subCat.getMainCategory();

            MainCategoryDto mainCategoryDto = MainCategoryDto.builder()
                    .categoryId(mainCat.getCategoryId())
                    .categoryName(mainCat.getCategoryName())
                    .build();

            SubCategoryDto subCategoryDto = SubCategoryDto.builder()
                    .subCategoryId(subCat.getSubCategoryId())
                    .subCategoryName(subCat.getSubCategoryName())
                    .mainCategory(mainCategoryDto)
                    .build();

            List<ProductFeature> productFeatures = product.getProductFeatures();
            List<FeatureDto> featureDtos = new ArrayList<>();

            for(ProductFeature pf : productFeatures) {
                Feature feature = pf.getFeature();

                FeatureDto featureDto = FeatureDto.builder()
                        .featureId(feature.getFeatureId())
                        .featureName(feature.getFeatureName())
                        .build();

                featureDtos.add(featureDto);
            }

            ProductDto productDto = ProductDto.builder()
                    .productId(product.getProductId())
                    .productName(product.getProductName())
                    .productLink(product.getProductLink())
                    .productDescription(product.getProductDescription())
                    .productPrice(product.getProductPrice())
                    .productImage(product.getProductImage())
                    .subCategory(subCategoryDto)
                    .features(featureDtos)
                    .build();

            return productDto;
        });

        return productDtos;
    }

    /**
     * 제품 추천 list 반환
     * @param userId
     * @param diagnosisDto
     * @return
     */
    @Transactional
    public List<ProductDto> recommendProductList(String userId, DiagnosisDto diagnosisDto) {
        UserInfo user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 1. 진단 점수 기반으로 가중치 있는 feature 추출
        Map<String, Double> weightedFeatures = clusteringService.addFeatures(diagnosisDto);

        // 2. 진단 정보를 벡터화
        double[] userVector = clusteringService.vectorize(weightedFeatures);

        // 3. 클러스터 예측
        int clusterLabel = clusteringService.predictCluster(userVector);

        // 4. 해당 클러스터에 속하는 제품 필터링
        List<Product> allClustered = clusteringService.getClusteredProducts(clusterLabel);

        return allClustered.stream().map(product -> {
            SubCategoryDto subCategoryDto = SubCategoryDto.builder()
                    .subCategoryId(product.getSubCategory().getSubCategoryId())
                    .subCategoryName(product.getSubCategory().getSubCategoryName())
                    .mainCategory(MainCategoryDto.builder()
                            .categoryId(product.getSubCategory().getMainCategory().getCategoryId())
                            .categoryName(product.getSubCategory().getMainCategory().getCategoryName())
                            .build())
                    .build();

            List<FeatureDto> featureDtos = product.getProductFeatures().stream()
                    .map(pf -> FeatureDto.builder()
                            .featureId(pf.getFeature().getFeatureId())
                            .featureName(pf.getFeature().getFeatureName())
                            .build())
                    .collect(Collectors.toList());

            return ProductDto.builder()
                    .productId(product.getProductId())
                    .productName(product.getProductName())
                    .productLink(product.getProductLink())
                    .productDescription(product.getProductDescription())
                    .productPrice(product.getProductPrice())
                    .productImage(product.getProductImage())
                    .subCategory(subCategoryDto)
                    .features(featureDtos)
                    .build();
        }).collect(Collectors.toList());
    }

}
