package com.ssafy.b204.favorite.controller;

import com.ssafy.b204.favorite.dto.ProductResponse;
import com.ssafy.b204.favorite.service.FavoriteService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorite")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    /**
     * 상품 찜하기
     * @param productId
     * @param httpRequest
     * @return
     */
    @PostMapping("/create")
    public ResponseEntity<?> createFavorite(
            @RequestParam int productId,
            HttpServletRequest httpRequest) {

        String userId = (String) httpRequest.getAttribute("kakaoId");

        favoriteService.createFavorite(productId, userId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * 상품 찜 삭제하기
     * @param productId
     * @param httpRequest
     * @return
     */
    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<?> deleteFavorite(
            @PathVariable int productId,
            HttpServletRequest httpRequest) {

        String userId = (String) httpRequest.getAttribute("kakaoId");

        favoriteService.deleteFavorite(productId, userId);

        return ResponseEntity.noContent().build();
    }

    /**
     * 찜 목록 조회하기
     * @param httpRequest
     * @return
     */
    @GetMapping("/list")
    public ResponseEntity<List<ProductResponse>> getAllFavorites(HttpServletRequest httpRequest) {

        String userId = (String) httpRequest.getAttribute("kakaoId");

        List<ProductResponse> favorites = favoriteService.getAllFavorites(userId);

        return ResponseEntity.ok(favorites);
    }
}
