package com.ssafy.b204.global.exception;

public class ProductNotFoundException extends NotFoundException {
    public ProductNotFoundException(int productId) {
        super("상품을 찾을 수 없습니다: " + productId);
    }
}
