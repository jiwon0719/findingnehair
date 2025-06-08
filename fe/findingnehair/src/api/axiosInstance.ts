/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
// import { queryClient } from '../main';
// AxiosError, AxiosResponse, 


//로컬 주소, 테스트 api 주소, 배포 api 주소
export const baseURL = import.meta.env.VITE_BASE_URL;


//axios 인스턴스 생성
const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    timeout: 1000000,
    withCredentials: true,
});

// const refreshAxiosInstance: AxiosInstance = axios.create({
//     baseURL,
//     timeout: 3000,
//     withCredentials: true,
//   });

//axios 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
}, (error) => {
    return Promise.reject(error);
});


// AXIOS 응답 인터셉터: 401시 토큰 재발급 후 재요청
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any; // originalRequest를 any로 캐스팅

    // accessToken 만료로 인한 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${baseURL}/auth/refresh`,
          null,
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); // 재요청
        } else {
          console.error("토큰 재발급 실패");
        }
      } catch (err) {
        console.error("재로그인 필요", err);
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // 로그아웃 처리
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
