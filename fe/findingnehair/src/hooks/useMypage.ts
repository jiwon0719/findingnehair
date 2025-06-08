import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import {getScalpHistory,gemtMyArticle, deleteMyAccount} from "../api/mypageapi"
import useUserStore from "../store/userStore";
import Swal from "sweetalert2";



// -- 두피진단기록 조회 쿼리 --

/**
 * 두피 진단 내역 조회 (GET) - useQuery 사용
 * @param page 페이지 번호
 * @param size 페이지 당 항목 수
 * @param options useQuery 옵션 (e.g., enabled, staleTime, cacheTime 등)
 */
    export const UseGetScalpHistory = (page: number, size: number, options?: object) => {
        return useQuery({
            // 쿼리 키: 페이지와 사이즈가 변경될 때마다 새로운 데이터를 불러오도록 키에 포함
            queryKey: ['scalpHistory', page, size],
            // 쿼리 함수: API 호출 함수
            queryFn: () => getScalpHistory(page, size),
            // 추가 옵션 (예: 이전 데이터 유지하며 로딩 상태 보여주기)
            ...options,
            keepPreviousData: true // 페이지네이션
        });
};

/**
 * 내 게시글 조회 (GET) - useQuery 사용
 * @param page 페이지 번호
 * @param size 페이지 당 항목 수
 * @param options useQuery 옵션
 */
export const useGetMyArticle = (page: number, size: number, options?: object) => {
    return useQuery({
        // 쿼리 키: 페이지와 사이즈가 변경될 때마다 새로운 데이터를 불러오도록 키에 포함
        queryKey: ['myArticle', page, size],
        // 쿼리 함수: API 호출 함수 (오타 수정된 함수 사용)
        queryFn: () => gemtMyArticle(page, size),
        ...options,
        keepPreviousData: true // 페이지네이션
    });
};

/**
 * 계정 삭제 Mutation (DELETE) - useMutation 사용
 */
export const useDeleteMyAccount = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { logout } = useUserStore(); // userStore의 logout 함수 사용

    return useMutation(deleteMyAccount, {
        onSuccess: () => {
            // 탈퇴 성공 메시지 표시
            Swal.fire({
                title: '탈퇴 성공',
                text: '성공적으로 탈퇴되었습니다.',
                icon: 'success',
                confirmButtonColor: "#5CC6B8",
                confirmButtonText: "확인",
                width: "450px",
                background: "#f8f9fa",
                customClass: {
                    title: "custom-title",
                }
            });

            // 로그아웃 처리 (userStore의 logout 함수 사용)
            logout();

            // 모든 쿼리 무효화 (필요에 따라 특정 쿼리만 무효화 가능)
            queryClient.invalidateQueries();

            // 로그인 페이지로 이동
            navigate("/login");
        },
        onError: (error) => {
            // 에러 처리 로직
            console.error("계정 삭제 실패:", error);
            // 에러 발생 시 사용자에게 알림 또는 다른 에러 처리 수행
            Swal.fire({
                title: '탈퇴 실패',
                text: '탈퇴에 실패했습니다. 다시 시도해주세요.',
                icon: 'error',
                confirmButtonColor: "#5CC6B8",
                confirmButtonText: "확인",
                width: "450px",
                background: "#f8f9fa",
                customClass: {
                title: "custom-title",
                }
            });
        },
    });
};
