import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import remarkGfm from 'remark-gfm';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom'; // useLocation import 추가
// 수정된 React Query 훅 import (경로 확인 필요)
import { useCommunityDetail, usePutCommunity } from '../../../store/communityStore'; // 수정: communityStore 경로 가정

const EditPostPage: React.FC = () => {
    const location = useLocation(); // useLocation 훅 사용
    const navigate = useNavigate();
    //state로 전달된 boardId를 가져옴
    const boardId = location.state?.boardId as number;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState<string | undefined>('');

    // 1. 게시글 상세 정보 조회 (useQuery 사용)
    //    - boardId가 유효할 때만 쿼리 실행 (훅 내부 enabled 옵션 활용)
    const {
        data: postData,         // 불러온 게시글 데이터
        isLoading: isFetching,  // 데이터 로딩 상태
        isError: isFetchError,  // 데이터 로딩 에러 발생 여부
        error: fetchError       // 데이터 로딩 에러 객체
    } = useCommunityDetail(boardId); // boardId (number) 전달

    // 2. 게시글 수정 Mutation 훅 사용
    const {
        mutate: updatePost,     // 수정 요청 실행 함수
        isLoading: isUpdating, // 수정 요청 진행 상태 (로딩)
        isError: isUpdateError, // 수정 요청 에러 발생 여부
        error: updateError      // 수정 요청 에러 객체
    } = usePutCommunity();

    // 3. 데이터 로딩 완료 시 폼 상태 초기화
    useEffect(() => {
        // postData가 성공적으로 불러와졌고, 내용이 있다면 상태 업데이트
        if (postData) {
            setTitle(postData.title || ''); // API 응답 구조에 맞게 필드명 확인 필요
            setContent(postData.content || ''); // API 응답 구조에 맞게 필드명 확인 필요
        }
    }, [postData]); // postData가 변경될 때만 실행

    // 에디터 내용 변경 핸들러
    const handleEditorChange = (value: string | undefined) => {
        setContent(value);
    };

    // 글 수정 처리
    const handleSubmit = () => {
        if (!boardId) { // boardId 유효성 추가 확인
            Swal.fire({
                            title: "게시글 정보를 확인할 수 없습니다.",
                            text: "게시글 ID가 유효하지 않습니다.",
                            icon: "warning",
                            confirmButtonColor: "#5CC6B8",
                            confirmButtonText: "확인",
                            width: "450px",
                            background: "#f8f9fa",
                            customClass: {
                              icon: "custom-icon",
                              title: "custom-title",
                            }
                          });
             return;
        }

        // 입력값 유효성 검사
        if (!title.trim()) {
            Swal.fire({
                            title: "입력값을 확인해주세요!",
                            text: "제목을 입력해주세요.",
                            icon: "warning",
                            confirmButtonColor: "#5CC6B8",
                            confirmButtonText: "확인",
                            width: "450px",
                            background: "#f8f9fa",
                            customClass: {
                              icon: "custom-icon",
                              title: "custom-title",
                            }
                          });
            return;
        }
        if (!(content || '').trim()) {
            Swal.fire({
                            title: "입력값을 확인해주세요!",
                            text: "내용을 입력해주세요.",
                            icon: "warning",
                            confirmButtonColor: "#5CC6B8",
                            confirmButtonText: "확인",
                            width: "450px",
                            background: "#f8f9fa",
                            customClass: {
                              icon: "custom-icon",
                              title: "custom-title",
                            }
                          });
            return;
        }

        // 서버로 보낼 수정 데이터 객체 생성
        const updatedData = {
            title: title,
            content: content,
            // API 명세에 따라 필요한 다른 필드 추가
        };

        // 수정 요청 실행 (boardId와 data 전달)
        updatePost({ boardId, data: updatedData }, {
            onSuccess: (response: object) => {
                console.log('Post updated successfully:', response);
                Swal.fire({
                    icon: "success",
                    title: "게시글 수정 완료",
                    text: "게시글이 성공적으로 수정되었습니다.",
                    confirmButtonColor: "#5CC6B8",
                    confirmButtonText: "확인",
                    width: "450px",
                    background: "#f8f9fa",
                    customClass: {
                      title: "custom-title",
                    }
            });
                // alert('게시글이 성공적으로 수정되었습니다.');
                // 성공 시 이전 페이지(상세 또는 목록)로 이동
                navigate(-1);
                // 캐시 무효화는 usePutCommunity 훅의 onSuccess에서 처리됨
            },
        });
    };

    // 취소 처리 (뒤로 가기)
    const handleCancel = () => {
        if (isUpdating) return; // 수정 중 취소 방지
        navigate(-1);
    };

    // --- 로딩 및 에러 상태 처리 ---
    if (isFetching) {
        return <div className="flex justify-center items-center min-h-screen">게시글 정보를 불러오는 중...</div>;
    }

    if (isFetchError || !postData) { // 데이터 로딩 실패 또는 데이터 없음
        console.error("게시글 로딩 에러:", fetchError);
        return (
             <div className="flex flex-col items-center justify-center min-h-screen">
                <p>게시글 정보를 불러오는데 실패했습니다.</p>
                <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
                   뒤로가기
                </button>
             </div>
        );
    }
    // --- 로딩 및 에러 처리 끝 ---


    return (
        // --- CreatePostPage와 동일한 레이아웃 사용 ---
        <div className="flex flex-col w-[445px] max-w-md min-h-screen mx-auto bg-[#F2F6F5] p-4">
            {/* 헤더 */}
            <div className="flex items-center p-4">
                <button onClick={handleCancel} className="text-4xl mr-2 cursor-pointer focus:outline-none" disabled={isUpdating}>‹</button>
                <h1 className="text-xl font-bold text-center w-full">글 수정</h1> {/* 제목 변경 */}
            </div>

            {/* 게시글 수정 폼 영역 */}
            <div className="border border-gray-300 rounded-lg p-4 mt-5 mb-4 bg-white flex-grow flex flex-col">

                {/* 제목 입력 */}
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#5CC6B8]"
                    value={title} // 상태와 연결 (useEffect로 초기화됨)
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isUpdating} // 수정 요청 중 비활성화
                    required
                />

                {/* @uiw/react-md-editor */}
                <div className="flex-grow mb-4" data-color-mode="light">
                    <MDEditor
                        value={content} // 상태와 연결 (useEffect로 초기화됨)
                        onChange={handleEditorChange}
                        height="100%"
                        minHeight={300}
                        preview={'edit'}
                        previewOptions={{
                            remarkPlugins: [remarkGfm],
                        }}
                    />
                </div>

                {/* 수정 에러 메시지 표시 */}
                {isUpdateError && (
                   <div className="text-red-500 text-sm mb-2">
                      오류 발생: {updateError instanceof Error ? updateError.message : '게시글 수정 중 문제가 발생했습니다.'}
                   </div>
                )}

                {/* 버튼 영역 */}
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150 ease-in-out text-base disabled:opacity-50"
                        onClick={handleCancel}
                        disabled={isUpdating}
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-[#5CC6B8] text-white rounded hover:bg-[#4aabb8] focus:outline-none focus:ring-2 focus:ring-[#5CC6B8] focus:ring-offset-1 transition duration-150 ease-in-out text-base disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={isUpdating} // 수정 요청 중 비활성화
                    >
                        {/* 버튼 텍스트 변경 */}
                        {isUpdating ? '수정 중...' : '수정'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPostPage;