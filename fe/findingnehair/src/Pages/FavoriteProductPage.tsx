import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// API 함수 import (경로 확인 필수)
import { getFavorites } from "../api/productapi"; // Using the API function

// 커스텀 훅 import (경로 확인)
import { useFavoriteMutations } from "../hooks/useFavoriteMutations"; // For removal logic

// 컴포넌트 및 타입 import (경로 확인)
import ProductList from "../components/Features/recommend/ProductList";
import { DisplayProduct } from "../types/ProductTypes"; // Only DisplayProduct needed here
import LoadingAnimation from "../components/ui/LoadingAnimation";

// --- Type Definition for API Response (Based on your provided data) ---
// 이 타입을 별도의 types 파일로 옮기는 것이 좋습니다.
interface FavoriteApiProduct {
    productId: number;
    productName: string;
    productLink: string;
    productDescription: string | null; // Can be empty string or potentially null
    productPrice: number;
    productImage: string;
    // categoryName, features 등은 없으므로 포함하지 않음
}
// --- End Type Definition ---

// getTypeFromCategoryName 함수는 더 이상 필요 없으므로 제거합니다.

const FavoriteProductPage = () => {
    const navigate = useNavigate();

    // --- State ---
    // API로부터 받은 원본 찜 목록 데이터 (타입 업데이트)
    const [favoriteApiProducts, setFavoriteApiProducts] = useState<FavoriteApiProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    // --- Custom Hooks ---
    const { removeFavoriteMutation } = useFavoriteMutations();

    // --- Data Fetching ---
    useEffect(() => {
        const fetchFavorites = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                // getFavorites API 호출
                const data: FavoriteApiProduct[] = await getFavorites(); // Assume it returns FavoriteApiProduct[]
                setFavoriteApiProducts(data || []);
            } catch (error) {
                console.error("찜 목록을 불러오는 중 오류 발생:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, []); // 컴포넌트 마운트 시 1회 실행

    // --- Derived State & Memos ---
    const displayProducts: DisplayProduct[] = useMemo(() => {
        // API 데이터를 ProductList가 요구하는 DisplayProduct 형식으로 변환
        return favoriteApiProducts.map((product): DisplayProduct => {
            // --- 중요: DisplayProduct 타입 요구사항 확인 ---
            // ProductList가 사용하는 DisplayProduct 타입이 어떤 필드를 필수로 요구하는지 확인해야 합니다.
            // 아래는 제공된 API 데이터와 필수/가정된 필드를 기반으로 한 매핑 예시입니다.

            // 1. API 응답의 모든 필드 일단 포함 (타입 일치 확인)
            const baseProductData = {
                productId: product.productId,
                productName: product.productName,
                productLink: product.productLink,
                productDescription: product.productDescription ?? '', // null일 경우 빈 문자열
                productPrice: product.productPrice,
                productImage: product.productImage,
            };

            // 2. DisplayProduct에 필요한 추가/수정 필드 설정
            return {
                ...baseProductData,

                // --- 필수 또는 ProductList에서 사용하는 필드 ---
                isFavorite: true, // 찜 목록 페이지이므로 항상 true

                // --- 카테고리/태그 정보 없음 ---
                type: 'unknown', // 카테고리 정보 없으므로 'unknown' 또는 다른 기본값 설정
                tags: [],        // features 정보 없으므로 빈 배열

                // --- DisplayProduct에 있을 수 있는 추가 필드 (기본값 할당) ---
                // 만약 DisplayProduct가 이 필드들을 요구한다면 기본값을 넣어줘야 합니다.
                // ProductList 구현을 확인하고 필요에 따라 주석 해제 또는 수정하세요.
                // brandName: 'Unknown Brand', // 브랜드 정보가 API 응답에 없음
                // averageRating: 0, // 평점 정보가 API 응답에 없음
                // reviewCount: 0, // 리뷰 수 정보가 API 응답에 없음
                // discountedPrice: null, // 할인 가격 정보가 API 응답에 없음 (productPrice 사용)
                // isOutOfStock: false, // 재고 정보가 API 응답에 없음

                // ... DisplayProduct에 필요한 다른 모든 필드 ...
            };
        });
    }, [favoriteApiProducts]); // favoriteApiProducts가 변경될 때만 재계산

    // --- Event Handlers ---
    const handleToggleFavorite = useCallback((productId: number) => { // currentIsFavorite 제거 가능
        if (removeFavoriteMutation.isLoading) {
            return;
        }
        removeFavoriteMutation.mutate(productId, {
            onSuccess: () => {
                setFavoriteApiProducts(prevProducts =>
                    prevProducts.filter(p => p.productId !== productId)
                );
                // Optional: Show success feedback
                // console.log("찜 목록에서 삭제되었습니다.");
            },
            onError: (error) => {
                console.error("찜 해제 중 오류 발생:", error);
                Swal.fire({
                    title: '찜 해제 실패',
                    text: '찜 해제 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonColor: "#5CC6B8",
                    confirmButtonText: "확인",
                    width: "450px",
                    background: "#f8f9fa",
                    customClass: {
                    title: "custom-title",
                    }
                });
            }
        });
    }, [removeFavoriteMutation]); // 의존성 배열에서 setFavoriteApiProducts 제거 (useState setter는 안정적)

    // --- Render ---
    return (
        <div className="flex flex-col w-full max-w-md mx-auto justify-center p-4 pb-24">
            {/* Header */}
            <div className="flex items-center p-3 mb-4">
                <button onClick={() => navigate(-1)} className="ml-1 mt-1 text-4xl cursor-pointer">
                    &lsaquo;
                </button>
                <h1 className="text-xl font-bold text-center w-full">찜한 상품</h1>
            </div>

            {/* Product List Area */}
            <div className="min-h-[calc(100vh-200px)]"> {/* Adjust min-height as needed */}
                {isLoading ? (
                    <LoadingAnimation text="찜 목록을 불러오는 중.." loading={true} /> // 로딩 애니메이션
                ) : isError ? (
                    <div className="text-center p-10 text-red-600">찜 목록을 불러오는 중 오류가 발생했습니다.</div>
                ) : (
                    <>
                        {displayProducts.length > 0 ? (
                            <ProductList
                                products={displayProducts}
                                onToggleFavorite={handleToggleFavorite} // Pass the updated handler
                            />
                        ) : (
                            <div className="text-center p-10 text-gray-500">찜한 상품이 없습니다.</div>
                        )}
                    </>
                )}
            </div>
            {/* No Pagination */}
        </div>
    );
};

export default FavoriteProductPage;