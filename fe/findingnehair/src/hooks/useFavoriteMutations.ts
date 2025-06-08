// react-query v5 기준으로 import 수정
import { useMutation, useQueryClient } from 'react-query';
import { postFavorite, deleteFavorite } from '../api/productapi'; // API 함수 경로 확인
import { ApiProduct } from '../types/ProductTypes'; // ApiProductResponse는 여기선 불필요

// updateProductCache 함수는 제거합니다.

export const useFavoriteMutations = () => {
    const queryClient = useQueryClient();
    const commonMutationOptions = {
        // 뮤테이션 성공/실패 후 항상 실행
        onSettled: () => {
            // 찜 목록 쿼리는 항상 최신화 (서버 상태와 동기화)
            queryClient.invalidateQueries({ queryKey: ['favorites'] }); // v5 방식
        },
    };

    // 찜 추가 뮤테이션 (v5 옵션 객체 방식)
    const addFavoriteMutation = useMutation<unknown, Error, number, { previousFavoritesData: ApiProduct[] }>({ // 제네릭 타입 명시
        mutationFn: postFavorite, // API 호출 함수
        ...commonMutationOptions,
        onMutate: async (productId: number) => {
            // 진행 중인 'favorites' 쿼리 취소
            await queryClient.cancelQueries({ queryKey: ['favorites'] }); // v5 방식

            // 현재 'favorites' 캐시 데이터 스냅샷
            const previousFavoritesData = queryClient.getQueryData<ApiProduct[]>(['favorites']) || [];

            // 낙관적 업데이트: 'favorites' 캐시에 새 항목 (임시) 추가
            // getFavorites API가 반환하는 형식과 최대한 유사하게 만듭니다.
            // 여기서는 productId만 필수라고 가정합니다. 실제 API 응답에 맞춰 조정하세요.
            const optimisticNewFavorite: ApiProduct = {
                productId,
                // --- 다른 기본값 또는 필수값들 ---
                // 예시: productName, productLink 등 API 응답에 포함된 다른 필드가 있다면
                //      기본값이나 임시값을 넣어주는 것이 좋을 수 있습니다. (롤백 시 비교 등)
                //      하지만 필수적인 것은 아닙니다. ID만으로도 필터링/추가는 가능합니다.
                productName: '...', // 임시값 예시
                productLink: '',
                productDescription: '',
                productPrice: 0,
                productImage: '',
                // subCategory, features 등도 필요하다면 추가
             } as ApiProduct; // 타입 단언 사용 시 주의

            queryClient.setQueryData<ApiProduct[]>(['favorites'], [...previousFavoritesData, optimisticNewFavorite]);

            // updateProductCache 호출 제거

            // 롤백을 위한 이전 데이터 반환
            return { previousFavoritesData };
        },
        onError: (error, productId, context) => {
            console.error("찜 추가 실패:", error);
            // 에러 발생 시 'favorites' 캐시 롤백
            if (context?.previousFavoritesData) {
                queryClient.setQueryData(['favorites'], context.previousFavoritesData);
            }
            // updateProductCache 호출 제거
        },
    });

    const removeFavoriteMutation = useMutation<unknown, Error, number, { previousFavoritesData: ApiProduct[] }>({ // 제네릭 타입 명시
        mutationFn: deleteFavorite, // API 호출 함수
        ...commonMutationOptions,
        onMutate: async (productId: number) => {
            await queryClient.cancelQueries({ queryKey: ['favorites'] }); // v5 방식
            const previousFavoritesData = queryClient.getQueryData<ApiProduct[]>(['favorites']) || [];

            // 낙관적 업데이트: 'favorites' 캐시에서 해당 항목 제거
            queryClient.setQueryData<ApiProduct[]>(
                ['favorites'],
                previousFavoritesData.filter(fav => fav.productId !== productId)
            );

            // updateProductCache 호출 제거

            return { previousFavoritesData };
        },
        onError: (error, productId, context) => {
            console.error("찜 삭제 실패:", error);
            if (context?.previousFavoritesData) {
                queryClient.setQueryData(['favorites'], context.previousFavoritesData);
            }
            // updateProductCache 호출 제거
        },
    });

    // updateProductCache는 더 이상 반환하지 않음
    return { addFavoriteMutation, removeFavoriteMutation };
};