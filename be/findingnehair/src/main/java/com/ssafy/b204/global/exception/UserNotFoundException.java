package com.ssafy.b204.global.exception;

public class UserNotFoundException extends NotFoundException {
    public UserNotFoundException(String userId) {
        super("사용자를 찾을 수 없습니다 : " + userId);
    }
}