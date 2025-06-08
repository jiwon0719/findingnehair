package com.ssafy.b204.global.exception;

public class AlreadyFavoritedException extends RuntimeException {
    public AlreadyFavoritedException(int productId) {
        super("이미 찜한 상품입니다: " + productId);
    }
}
