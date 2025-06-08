package com.ssafy.b204.favorite.service;

import com.ssafy.b204.entity.Product;
import com.ssafy.b204.entity.ProductFavorite;
import com.ssafy.b204.entity.ProductFavoriteId;
import com.ssafy.b204.entity.UserInfo;
import com.ssafy.b204.favorite.dto.ProductResponse;
import com.ssafy.b204.global.exception.AlreadyFavoritedException;
import com.ssafy.b204.global.exception.NotFavoritedException;
import com.ssafy.b204.global.exception.ProductNotFoundException;
import com.ssafy.b204.global.exception.UserNotFoundException;
import com.ssafy.b204.repository.ProductFavoriteRepository;
import com.ssafy.b204.repository.ProductRepository;
import com.ssafy.b204.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final ProductFavoriteRepository productFavoriteRepository;
    private final ProductRepository productRepository;
    private final UserInfoRepository userInfoRepository;

    /**
     * 상품 찜하기
     * @param productId
     * @param userId
     * @return
     */
    @Transactional
    public void createFavorite(int productId, String userId) {
        // 이미 찜했는지 확인
        ProductFavoriteId favoriteId = new ProductFavoriteId(productId, userId);
        if(productFavoriteRepository.existsById(favoriteId)) {
            throw new AlreadyFavoritedException(productId);
        }

        // 사용자 정보 조회
        UserInfo userInfo  = userInfoRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // 상품 정보 조회
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        // 찜하기
        ProductFavorite favorite = new ProductFavorite();
        favorite.setId(favoriteId);
        favorite.setProduct(product);
        favorite.setUserInfo(userInfo);

        productFavoriteRepository.save(favorite);
    }

    /**
     * 상품 찜 삭제하기
     * @param productId
     * @param userId
     */
    public void deleteFavorite(int productId, String userId) {
        ProductFavoriteId favoriteId = new ProductFavoriteId(productId, userId);

        if(!productFavoriteRepository.existsById(favoriteId)) {
            throw new NotFavoritedException(productId);
        }

        productFavoriteRepository.deleteById(favoriteId);
    }


    /**
     * 찜 목록 조회하기
     * @param userId
     * @return
     */
    public List<ProductResponse> getAllFavorites(String userId) {
        // 사용자 정보 확인
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // 찜 목록 조회(fetch join 활용)
        List<Product> products = productRepository.findFavoriteProductsByUserIdWithFetch(userId);

        // DTO 반환
        List<ProductResponse> responses = new ArrayList<>();
        for(Product product : products) {
            ProductResponse response = ProductResponse.builder()
                    .productId(product.getProductId())
                    .productName(product.getProductName())
                    .productDescription(product.getProductDescription())
                    .productPrice(product.getProductPrice())
                    .productImage(product.getProductImage())
                    .productLink(product.getProductLink())
                    .build();

            responses.add(response);
        }

        return responses;
    }
}
