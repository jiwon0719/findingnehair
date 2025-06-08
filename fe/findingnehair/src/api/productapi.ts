import axiosInstance from "./axiosInstance";
import { ApiProductResponse, ApiProduct } from "../types/ProductTypes";

interface ScalapStatus {
    microKeratin: number,                      // 원본 목록에 있었으므로 기본값 0으로 추가
    excessSebum: number,                       // '지성' 항목의 mydata 값
    follicularErythema: number,                // '두피홍반' 항목의 mydata 값
    follicularInflammationPustules: number,    // '모낭홍반' 항목의 mydata 값 (매핑 추정)
    dandruff: number,                          // '비듬' 항목의 mydata 값
    hairLoss: number, 
  }
  

//// 상품 전체 조회
export const getProducts = async (
    page: number, // API가 0-based 페이지를 사용한다면 여기서 page - 1 처리
    size: number,
    mainCategory: string | null | undefined,
    subCategory: string | null | undefined
): Promise<ApiProductResponse> => { // Promise 반환 타입 명시

    // URLSearchParams를 사용하여 쿼리 파라미터 관리
    const params = new URLSearchParams({
// API 페이지 기준에 맞게 조정 (예: 0-based면 String(page-1))
        limit: String(size),
    });

    // page 파라미터는 필수이므로 항상 추가 (API 기준에 맞게)
    // 백엔드 API가 0부터 시작하는 페이지 번호를 사용한다고 가정합니다.
    params.append('page', String(page));

    // mainCategory 값이 존재할 경우 (null, undefined, 빈 문자열 아님) 파라미터 추가
    if (mainCategory) {
        params.append('mainCategory', mainCategory);
    }

    // subCategory 값이 존재할 경우 (null, undefined, 빈 문자열 아님) 파라미터 추가
    // ProductPage에서 ?? '' 로 처리하므로 빈 문자열 체크도 포함됨
    if (subCategory) {
        params.append('subCategory', subCategory);
    }

    // 최종 URL 생성
    const url = `/product/list?${params.toString()}`; // axiosInstance baseURL 기준 상대 경로

    try {
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // 에러를 호출 측으로 전파
    }
}

// 찜하기
export const postFavorite = async (productId: number) => {
    const response = await axiosInstance.post(
        `/favorite/create?productId=${productId}`
    )
    return response
}


//찜 삭제하기
export const deleteFavorite = async (productId: number) => {
    const response = await axiosInstance.delete(
        `/favorite/delete/${productId}`
    )
    return response
}


//찜한 상품만 조회
export const getFavorites = async () => {
    const response = await axiosInstance.get(
        `/favorite/list`
    )
    return response.data;
}


// k-NN 추천 상품 조회
export const getRecommend = async (payload : ScalapStatus) => {
    const response = await axiosInstance.post(
        `/product/recommend`, payload
    )
    return response.data as ApiProduct[];
}

