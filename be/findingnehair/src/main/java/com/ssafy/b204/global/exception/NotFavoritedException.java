package com.ssafy.b204.global.exception;

public class NotFavoritedException extends RuntimeException {
    public NotFavoritedException(int productId) {
        super("찜한 상품이 아닙니다: " + productId);
    }
}
