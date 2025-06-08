import { useState, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

interface Options<T> {
    initialSize?: number;
    stepSize?: number;
    allItems: T[] | undefined; // 전체 데이터 배열
}

export function useClientSideInfiniteScroll<T>({
    initialSize = 5,
    stepSize = 5,
    allItems = [],
}: Options<T>) {
    const [visibleCount, setVisibleCount] = useState(initialSize);
    const totalItems = allItems?.length ?? 0;

    // 데이터 슬라이싱 (useMemo로 최적화)
    const visibleItems = useMemo(() => {
        return allItems?.slice(0, visibleCount) ?? [];
    }, [allItems, visibleCount]);

    // Intersection Observer 설정
    const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

    // 더 로드할지 여부
    const hasMore = visibleCount < totalItems;

    // 스크롤 감지 시 더 로드하는 로직
    useEffect(() => {
        if (inView && hasMore) {
            setVisibleCount(prevCount => Math.min(prevCount + stepSize, totalItems));
        }
    // inView, hasMore 변경 시 실행 (totalItems, stepSize는 거의 안 변하므로 제외 가능)
    }, [inView, hasMore, totalItems, stepSize]);

    // 컴포넌트 마운트 시 초기 개수 설정 (allItems 로딩 후 반영)
    useEffect(() => {
         setVisibleCount(initialSize);
    }, [allItems, initialSize]);


    return {
        visibleItems, // 현재 보여줄 아이템 배열
        loadMoreRef,  // 스크롤 감지 대상에 붙일 ref
        hasMore,      // 더 로드할 아이템이 있는지 여부
        // 필요하다면 reset 함수 등 추가 가능
    };
}