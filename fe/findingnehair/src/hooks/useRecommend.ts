import { useQuery, QueryFunctionContext } from 'react-query';
import { getFavorites, getRecommend } from '../api/productapi'; // API 함수 경로 확인
import { ApiProduct } from '../types/ProductTypes'; // 타입 경로 확인
import { useMemo } from 'react';
import { ScalapStatus } from '../types/DiagnosisTypes';

export const useFavorites = () => {
    const { data: favoriteProductsData, isLoading, isError } = useQuery<ApiProduct[], Error>(
        'favorites', // Query Key
        getFavorites,
        {
            staleTime: 10 * 60 * 1000, // 10분 (찜 목록은 상품보다 덜 변할 수 있음)
        }
    );

    // 찜 목록 데이터를 productId Set으로 변환 (빠른 조회를 위해)
    const favoriteProductIds = useMemo(() => {
      if (!Array.isArray(favoriteProductsData)) { // <- 배열 여부 확인
        return new Set<number>();
      }
      return new Set(favoriteProductsData.map(product => product.productId));
    }, [favoriteProductsData]);

    return {
        favoriteProductIds, // Set<number> 형태의 찜 상품 ID 목록
        isLoadingFavorites: isLoading,
        isErrorFavorites: isError,
        rawFavoriteData: favoriteProductsData // 원본 데이터가 필요할 경우 대비
    };
};


type RecommendQueryKey = ['recommendations', ScalapStatus | null | undefined];
export const useRecommend = (scalpStatusData: ScalapStatus | null | undefined) => {
// Query Key 타입 정의
  return useQuery<ApiProduct[], Error, ApiProduct[], RecommendQueryKey>(
    ['recommendations', scalpStatusData],
    async ({ queryKey: [, payload] }: QueryFunctionContext<RecommendQueryKey>) => {
      // enabled 옵션으로 인해 payload가 있을 때만 실행되지만, 방어 코드 추가
      if (!payload) return []; // 혹은 throw new Error("Payload required");
      return getRecommend(payload);
    },
    {
      staleTime: 10 * 60 * 1000,
      enabled: !!scalpStatusData,
    }
  );
}