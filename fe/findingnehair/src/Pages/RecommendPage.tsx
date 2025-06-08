import React, { useMemo, useCallback, useEffect, useState} from 'react'; // useEffect 추가

// 훅 임포트 경로 수정 (가정)
import { useRecommend, useFavorites } from '../hooks/useRecommend';
import { useFavoriteMutations } from '../hooks/useFavoriteMutations';
import { useClientSideInfiniteScroll } from '../hooks/useInfiniteScroll'; // 생성한 훅 임포트
import { getPollResult } from '../api/pollapi';
// 컴포넌트 및 타입 임포트
import ProductList from '../components/Features/recommend/ProductList';
import LoadingAnimation from '../components/ui/LoadingAnimation';
import { ApiProduct, DisplayProduct } from '../types/ProductTypes';
import { ScalapStatus } from '../types/DiagnosisTypes';
import Title from '../components/ui/Title';
import Swal from 'sweetalert2';
import useUserStore from '../store/userStore'; // 사용자 정보 훅
import { useNavigate } from 'react-router-dom'; // 네비게이션 훅
interface Props {
    scalpStatusData: ScalapStatus | null | undefined; // 두피 상태 데이터 (API 요청 시 사용)
}
const RecommendedProductSection: React.FC<Props> = ({ scalpStatusData }) => {
    const Navigate = useNavigate(); // 네비게이션 훅
    const user = useUserStore((state) => state.myProfile); // 사용자 정보 (가정)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pollResult, setPollResult] = useState<any>(null); // pollResult 상태 추가

    useEffect(() => {
        const fetchPollResult = async () => {
            try {
                const response = await getPollResult();
                setPollResult(response.data); // 응답 데이터 저장
            } catch (error) {
                console.error("Error fetching poll result:", error);
                // 에러 처리 (예: 사용자에게 알림)
            }
        };

        fetchPollResult();
    }, []); // 빈 의존성 배열로 컴포넌트 마운트 시에만 실행

    const { addFavoriteMutation, removeFavoriteMutation } = useFavoriteMutations(); // 찜하기 뮤테이션 훅

    // 1. 추천 상품 데이터 전체 가져오기 (변경 없음)
    const {
        data: recommendedProductsData, // 전체 600+개 데이터
        isLoading: isLoadingRecommend,
        isError: isErrorRecommend,
    } = useRecommend(scalpStatusData);

    // 2. 찜 목록 데이터 가져오기 (변경 없음)
    const {
        favoriteProductIds,
        isLoadingFavorites, // 변수 이름 충돌 없음 확인
        isErrorFavorites,                     // 변수 이름 충돌 없음 확인
    } = useFavorites();
    const {
        visibleItems: visibleApiProducts, // 현재 화면에 보여줄 상품 슬라이스
        loadMoreRef,                     // 스크롤 감지 대상 ref
        hasMore,                         // 더 로드할 아이템이 있는지 여부
        // reset, // 필요하다면 reset 함수 사용
    } = useClientSideInfiniteScroll<ApiProduct>({ // 제네릭 타입 <ApiProduct> 명시
        allItems: recommendedProductsData, // 전체 데이터 전달
        initialSize: 5,                     // 초기 로드 개수
        stepSize: 5,                        // 스크롤 시 추가 로드 개수
    });

    const displayProducts: DisplayProduct[] = useMemo(() => {
        // visibleApiProducts는 useClientSideInfiniteScroll 훅이 반환한
        // 현재 화면에 보여줘야 할 상품 목록 (예: 처음 5개, 다음 10개...)
        return visibleApiProducts.map((product: ApiProduct): DisplayProduct => {
            const tags = Array.isArray(product.features) ?
                product.features.map(f => {
                    if (typeof f === 'object' && 'featureName' in f) {
                        return f.featureName;
                    }
                    return '';
                })
                : [];
            return {
                ...product,
                isFavorite: favoriteProductIds.has(product.productId),
                tags: tags,
                type: product.subCategory?.subCategoryName === 'Shampoo' ? 'shampoo' :
                    product.subCategory?.subCategoryName === 'Rinse' ? 'rinse' :
                    product.subCategory?.subCategoryName === 'Treatment' ? 'treatment' :
                    'unknown', // Default to 'unknown' if no match
            };
        });
        // 의존성 배열에 recommendedProductsData 대신 visibleApiProducts 추가!
    }, [visibleApiProducts, favoriteProductIds]);

    const handleToggleFavorite = useCallback((productId: number, currentIsFavorite: boolean) => {
        if (addFavoriteMutation.isLoading || removeFavoriteMutation.isLoading) return;
        if (currentIsFavorite) {
            removeFavoriteMutation.mutate(productId);
        } else {
            addFavoriteMutation.mutate(productId);
        }
    }, [addFavoriteMutation, removeFavoriteMutation]);

    // 설문 결과가 없다면, 설문을 진행하라는 SW 메시지 표시
    if (pollResult && Array.isArray(pollResult) && pollResult.length === 0) {
        Swal.fire({
            title: '설문을 진행해주세요',
            text: '설문을 통해 맞춤형 추천을 받을 수 있습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '설문 진행하기',
            cancelButtonText: '취소',
        }).then((result) => {
            if (result.isConfirmed) {
                // 설문 페이지로 이동 (가정)
                Navigate('/poll'); // 실제 URL로 변경 필요
            } else {
                // 취소 시 다른 처리 (예: 홈으로 이동)
                Navigate('/');// 실제 URL로 변경 필요
            }
        });
        return null; // 또는 다른 UI 처리
    }

    const comment = `${user?.userNickname}님의 두피와 가장 유사한 사람들의 추천 상품이에요`;

    // 7. 로딩 및 에러 상태 통합 (변경 없음)
    //  - 초기 전체 데이터 로딩 상태를 기준으로 함
    const isLoading = isLoadingRecommend || isLoadingFavorites;
    const isError = isErrorRecommend || isErrorFavorites;

    // 8. 초기 로딩 중 표시 (변경 없음)
    if (isLoading) {
        return <div className="text-center p-8 text-gray-500">
            <LoadingAnimation loading={true} text="추천 상품을 불러오는 중..." />
        </div>;
    }

    // 9. 에러 발생 시 표시 (변경 없음)
    if (isError) {
        return <div className="text-center p-8 text-red-600">추천 상품을 불러오는 중 오류가 발생했습니다.</div>;
    }

    // 10. 추천 상품이 *전혀* 없을 때 표시
    //  - 전체 데이터(recommendedProductsData) 기준으로 판단해야 함
    //  - displayProducts는 슬라이스된 결과이므로, 초기 로드 시 0일 수 있음
    if (!recommendedProductsData || recommendedProductsData.length === 0) {
        return <div className="text-center p-8 text-gray-500">현재 두피 상태에 맞는 추천 상품이 없습니다.</div>;
    }

    // 11. 상품 목록 및 무한 스크롤 트리거 렌더링
    return (
        <div className="mt-0">
            <Title text={comment}></Title>
            <ProductList
                products={displayProducts} // 현재 보여줄 슬라이스된 상품 목록 전달
                onToggleFavorite={handleToggleFavorite}
            />
            {/* 더 로드할 상품이 있을 경우(hasMore === true) 스크롤 감지 영역 렌더링 */}
            {hasMore && (
                <div ref={loadMoreRef} style={{ height: '50px', textAlign: 'center', paddingTop: '10px' }}>
                    {/* 여기에 간단한 로딩 스피너나 "더보기" 텍스트 등을 추가할 수 있습니다. */}
                    {/* 예: <LoadingAnimation loading={true} size={20} /> */}
                    <span className="text-sm text-gray-500">더 많은 상품 로딩 중...</span>
                </div>
            )}
        </div>
    );
}

export default RecommendedProductSection;