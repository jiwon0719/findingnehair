import axiosInstance from './axiosInstance';
import { baseURL } from './axiosInstance';

// 카카오 로그인 URL
export const kakaokogin = () => {
    return `${baseURL}/oauth2/authorization/kakao`;
};

// 로그아웃 요청
export const logout = async () => {
    const response = await axiosInstance.post("/user/logout");
    return response.data;
};

// 사용자 프로필 정보 조회
export const getProfile = async () => {
    const response = await axiosInstance.get(`/mypage`);
    return response.data;
};


