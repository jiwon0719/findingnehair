import { useQuery } from 'react-query';
import { getProducts } from '../api/productapi';
import { ApiProductResponse } from '../types/ProductTypes';

interface UseProductsProps {
  page: number; // UI 기준 페이지 (1-based)
  size: number;
  mainCategory: string | null | undefined; // 백엔드 전달용 한국어 카테고리
  subCategory: string | null | undefined; // 한국어 서브카테고리 또는 ''
}

export const useProducts = ({ page, size, mainCategory, subCategory }: UseProductsProps) => {

  const apiPage = page - 1;

  // <<<--- 수정: queryKey에 mainCategory와 subCategory 포함 --- >>>
  // queryKey는 쿼리의 모든 의존성을 포함해야 합니다.
  const queryKey = ['products', mainCategory ?? 'allMain', subCategory ?? 'allSub', apiPage, size];
  // null 또는 빈 값 대신 고유한 플레이스홀더('allMain', 'allSub' 등) 사용 권장

  return useQuery<ApiProductResponse, Error>(
      queryKey, // 수정된 queryKey 사용
      // 실제 API 호출 시에는 조정된 페이지 번호(apiPage) 전달
      () => getProducts(apiPage, size, mainCategory, subCategory),
      {
          keepPreviousData: true, // 새 데이터 로딩 중 이전 데이터 유지 (페이지네이션/필터링에 유용)
          staleTime: 5 * 60 * 1000, // 5분 동안 fresh 상태 유지
          // enabled: !!mainCategory, // 필요시: mainCategory가 설정된 경우에만 쿼리 실행
      }
  );
};