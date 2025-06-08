import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

// 커스텀 훅 import (경로 확인)
import { useProducts } from "../hooks/useProducts"; // Updated hook
import { useFavorites } from "../hooks/useRecommend";
import { useFavoriteMutations } from "../hooks/useFavoriteMutations";

import Tabs from "../components/Forms/tabs"; // 컴포넌트 경로 확인
import ProductList from "../components/Features/recommend/ProductList"; // 컴포넌트 경로 확인
import { DisplayProduct, PaginationInfo, ApiProduct } from "../types/ProductTypes"; // 타입 경로 확인

type TabKey = 'shampoo' | 'rinse' | 'treatment';

// 1. getTypeFromCategoryName 함수 복구 (DisplayProduct의 type 필드가 TabKey를 요구할 경우 필요)
const getTypeFromCategoryName = (categoryName?: string): TabKey | 'unknown' => {
    // 백엔드에서 오는 실제 categoryName 값에 맞춰 비교 문자열 조정 필요
    if (categoryName === '샴푸') return 'shampoo';
    if (categoryName === '린스/트리트먼트') return 'rinse'; // 백엔드 값 확인 필요
    if (categoryName === '헤어에센스/오일') return 'treatment'; // 백엔드 값 확인 필요
    return 'unknown';
};

const mainCategoryToBackend: Record<TabKey, string> = {
    shampoo: '샴푸',
    rinse: '린스/트리트먼트',
    treatment: '헤어에센스/오일'
};
// -

// 2. subCategories 데이터 필터링: 요청하신 태그 목록만 포함
const subCategories: Record<TabKey | 'unknown', string[]> = {
    shampoo: ["일반샴푸", "탈모샴푸", "쿨샴푸", "샴푸바", "드라이샴푸", "보색샴푸", "대용량샴푸", "새치케어샴푸"],
    rinse: ["린스/컨디셔너", "트리트먼트/헤어팩", "두피스케일러"], // 요청 기반 목록 + 대표 카테고리명 포함
    treatment: ["헤어에센스", "컬링에센스", "헤어오일", "헤어미스트", "헤어토닉"],
    unknown: [],
};
// --- End Types/Utilities ---


const ProductPage = () => {
    const navigate = useNavigate();

    // --- State ---
    const [activeTab, setActiveTab] = useState<TabKey>('shampoo');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1); // UI page (1-based)
    const pageSize = 6;

    // --- Custom Hooks ---

    // 3. useProducts 호출 시 subCategory에 null 대신 빈 문자열('') 전달
    const {
        data: productResponse,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        // isFetching,
    } = useProducts({
        page: currentPage,
        size: pageSize,
        mainCategory: mainCategoryToBackend[activeTab],
        subCategory: selectedSubCategory ?? '', // null일 경우 빈 문자열 전달
    });

    const {
        favoriteProductIds, // Set<number>
        isLoadingFavorites,
        isErrorFavorites,
    } = useFavorites();

    const {
        addFavoriteMutation,
        removeFavoriteMutation
    } = useFavoriteMutations();

    // --- Derived State & Memos ---
    const displayProducts: DisplayProduct[] = useMemo(() => {
        const apiProducts: ApiProduct[] = productResponse?.content ?? [];

        // Map API data to the format needed by ProductList
        const mappedProducts = apiProducts.map((product): DisplayProduct => ({
            // ApiProduct의 모든 속성 일단 복사 (주의: DisplayProduct와 구조가 다를 수 있음)
            ...product,

            // DisplayProduct의 'type' 필드를 TabKey 타입으로 변환 (getTypeFromCategoryName 사용)
            type: getTypeFromCategoryName(product.subCategory?.mainCategory?.categoryName),

            // 'isFavorite' 상태 추가
            isFavorite: favoriteProductIds.has(product.productId),

            // 'tags' 생성 (features가 배열이라고 가정)
            tags: product.features?.map(f => f.featureName) ?? [],

            // --- 중요: ApiProduct와 DisplayProduct 간 필드 불일치 처리 ---
            // 만약 DisplayProduct가 brandName, averageRating 등을 요구하는데
            // ApiProduct에 해당 필드가 없다면 여기서 반드시 처리해야 합니다.
            // (예: 기본값 할당, DisplayProduct 타입 수정 등)
            // brandName: product.brand?.brandName ?? 'Unknown Brand',
            // ... 기타 필요한 필드 매핑 ...

        }));

        return mappedProducts;
    }, [productResponse, favoriteProductIds]); // getTypeFromCategoryName이 안정적이라면 의존성 배열에 불필요

    const paginationInfo: PaginationInfo | null = useMemo(() => {
        if (!productResponse) return null;
        return {
            currentPage: productResponse.pageable.pageNumber + 1,
            totalPages: productResponse.totalPages,
            isFirst: productResponse.first,
            isLast: productResponse.last,
        };
    }, [productResponse]);

    // --- Event Handlers ---
    // 핸들러 로직은 이전과 동일하게 유지 (페이지 리셋 등)
    const handleTabClick = (tabKeyString: string) => {
        if (tabKeyString === 'shampoo' || tabKeyString === 'rinse' || tabKeyString === 'treatment') {
            setActiveTab(tabKeyString);
            setSelectedSubCategory(null);
            setCurrentPage(1);
        } else {
            console.error("Received invalid tab key:", tabKeyString);
        }
    };

    const handleSubCategoryToggle = (sub: string) => {
        setSelectedSubCategory(prev => (prev === sub ? null : sub));
        setCurrentPage(1);
    };

    const handleToggleFavorite = useCallback((productId: number, currentIsFavorite: boolean) => {
        if (addFavoriteMutation.isLoading || removeFavoriteMutation.isLoading) {
            return;
        }
        if (currentIsFavorite) {
            removeFavoriteMutation.mutate(productId);
        } else {
            addFavoriteMutation.mutate(productId);
        }
    }, [addFavoriteMutation, removeFavoriteMutation]);

    const handlePageChange = (page: number) => {
        if (page > 0 && (!paginationInfo || page <= paginationInfo.totalPages)) {
             setCurrentPage(page);
        }
    };

    // --- Loading / Error State ---
    const isLoading = isLoadingProducts || isLoadingFavorites;
    const isError = isErrorProducts || isErrorFavorites;

    // --- Tab Items for UI ---
    // 4. 메인 탭 이름을 유지하기 위해 tabItems 직접 정의
    const tabItems = [
        { key: 'shampoo', label: '샴푸' },
        { key: 'rinse', label: '린스' }, // 또는 '린스/컨디셔너' 등 원하는 이름 사용
        { key: 'treatment', label: '트리트먼트' } // 또는 '헤어에센스' 등 원하는 이름 사용
    ];

    // --- Render ---
    return (
        <div className="flex flex-col w-full max-w-md mx-auto justify-center p-4 pb-24">
            {/* Header */}
            <div className="flex items-center p-3">
                <button onClick={() => navigate(-1)} className="ml-1 mt-1 text-4xl cursor-pointer">
                    &lsaquo;
                </button>
                <h1 className="text-xl font-bold text-center w-full">상품 확인</h1>
            </div>

            {/* Main Category Tabs (직접 정의한 tabItems 사용) */}
            <Tabs
                tabs={tabItems}
                activeTab={activeTab}
                onTabClick={handleTabClick}
                className=""
            />

            {/* Sub Category Buttons (필터링된 subCategories 사용) */}
            {activeTab && (
                <div className="flex flex-wrap gap-2 my-4 px-3">
                    {subCategories[activeTab]?.map((sub) => ( // 필터링된 목록으로 버튼 생성
                        <button
                            key={sub}
                            onClick={() => handleSubCategoryToggle(sub)}
                            className={`text-sm px-3 py-1 rounded-full border ${
                                selectedSubCategory === sub
                                    ? 'bg-[#5CC6B8] text-white border-transparent'
                                    : 'bg-white text-gray-600 border-gray-300'
                            } hover:brightness-95 transition`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            )}

             {/* Product List Area */}
             <div className="min-h-[300px]">
                 {isLoading && !productResponse ? (
                     <div className="text-center p-4 text-gray-500">데이터 로딩 중...</div>
                 ) : isError ? (
                     <div className="text-center p-4 text-red-600">오류가 발생했습니다.</div>
                 ) : (
                     <>
                         <ProductList
                             products={displayProducts}
                             onToggleFavorite={handleToggleFavorite}
                         />
                         {displayProducts.length === 0 && !isLoadingProducts && (
                             <div className="text-center p-4 text-gray-500">조건에 맞는 상품이 없습니다.</div>
                         )}
                     </>
                 )}
             </div>


            {/* Pagination Controls */}
            {paginationInfo && paginationInfo.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 my-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={paginationInfo.isFirst || isLoadingProducts }
                        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        이전
                    </button>
                    <span>
                        페이지 {currentPage} / {paginationInfo.totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={paginationInfo.isLast || isLoadingProducts}
                        className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductPage;