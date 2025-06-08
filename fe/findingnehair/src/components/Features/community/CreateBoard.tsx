import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import remarkGfm from 'remark-gfm';
import Swal from "sweetalert2";
// import axiosInstance from '../../../api/axiosInstance'; // 이제 usePostCommunity 훅을 사용하므로 직접적인 axiosInstance 사용은 제거 가능
import { usePostCommunity } from '../../../store/communityStore'; // React Query Mutation 훅 import (경로 확인 필요)

const CreatePostPage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<string | undefined>('');

    // React Query Mutation 훅 사용
    // isLoading: 뮤테이션(API 요청) 진행 중 여부 (기존 isSubmitting 대체)
    // error: 에러 객체
    // isError: 에러 발생 여부
    const { mutate: createPost, isLoading, error, isError } = usePostCommunity();

    // 에디터 내용 변경 핸들러
    const handleEditorChange = (value: string | undefined) => {
        setContent(value);
    };

    // (이미지 업로드 핸들러 - 필요시 유지)

    // 글 등록 처리 (React Query Mutation 사용하도록 수정)
    const handleSubmit = () => {
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

        // 서버로 보낼 데이터 객체 생성
        const postData = {
            title: title,
            content: content,
            // authorId 등 필요한 추가 데이터가 있다면 여기에 포함
        };

        // React Query의 mutate 함수 호출하여 게시글 생성 요청
        createPost(postData, {
            onSuccess: (response) => {
                // response: API 성공 시 반환되는 데이터 (훅의 mutationFn 반환값)
                console.log('Post submitted successfully:', response); // API 응답 로깅
                Swal.fire({
                    icon: "success",
                    title: "게시글 등록 완료!",
                    text: "게시글이 성공적으로 등록되었습니다.",
                    confirmButtonColor: "#5CC6B8",
                    confirmButtonText: "확인",
                    width: "450px",
                    background: "#f8f9fa",
                    customClass: {
                      // icon: "custom-icon",
                      title: "custom-title",
                    }
            });

                // 폼 초기화
                setTitle('');
                setContent('');

                // 목록 새로고침은 usePostCommunity 훅 내부의 onSuccess에서
                // queryClient.invalidateQueries(["communityList"]) 로 처리됨

                // 성공 후 이전 페이지로 이동
                navigate(-1);
            },
            onError: (err) => {
                // err: API 요청 실패 시 반환되는 에러 객체
                console.error("게시글 등록 중 오류 발생:", err);
                Swal.fire({
                    title: '게시글 등록 실패',
                    text: err instanceof Error ? err.message : '게시글 등록 중 오류가 발생했습니다' ,
                    icon: 'error',
                    confirmButtonColor: "#5CC6B8",
                    confirmButtonText: "확인",
                    width: "450px",
                    background: "#f8f9fa",
                    customClass: {
                    title: "custom-title",
                    }
                });
                // alert(`게시글 등록 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
                // 필요하다면 여기서 추가적인 에러 처리 로직 수행
            }
            // onSettled: 성공/실패 여부와 관계없이 항상 실행되는 콜백 (필요 시 사용)
            // onSettled: () => {
            //   console.log('Mutation finished.');
            // }
        });
    };

    // 취소 처리 (뒤로 가기)
    const handleCancel = () => {
        // isPending 상태일 때 취소 방지 또는 확인 로직 추가 가능
        if (isLoading) return;
        navigate(-1); // Go back to the previous page
    };


    return (
        // --- Mimicking PostDetail Layout ---
<div className="flex flex-col w-full max-w-md min-h-screen mx-auto bg-[#F2F6F5] p-4 rounded-t-3xl">
{/* 헤더 */}
            <div className="flex items-center p-4">
                <button onClick={handleCancel} className="text-4xl mr-2 cursor-pointer focus:outline-none" disabled={isLoading}>‹</button>
                <h1 className="text-xl font-bold text-center w-full">새 글 작성</h1>
            </div>

            {/* 게시글 작성 폼 영역 */}
            <div className="border border-gray-300 rounded-lg p-4 mt-5 mb-4 bg-white flex-grow flex flex-col">

                {/* 제목 입력 */}
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#5CC6B8]"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading} // 요청 중일 때 비활성화
                    required
                />

                {/* @uiw/react-md-editor */}
                <div className="flex-grow mb-4" data-color-mode="light">
                    <MDEditor
                        value={content}
                        onChange={handleEditorChange}
                        height="100%"
                        minHeight={300}
                        preview={'edit'}
                        previewOptions={{
                            remarkPlugins: [remarkGfm],
                        }}

                    />
                </div>

                {/* 에러 메시지 표시 */}
                {isError && (
                   <div className="text-red-500 text-sm mb-2">
                      오류 발생: {error instanceof Error ? error.message : '게시글 등록 중 문제가 발생했습니다.'}
                   </div>
                )}

                {/* 버튼 영역 */}
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150 ease-in-out text-base disabled:opacity-50"
                        onClick={handleCancel}
                        disabled={isLoading} // 요청 중일 때 비활성화
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-[#5CC6B8] text-white rounded hover:bg-[#4aabb8] focus:outline-none focus:ring-2 focus:ring-[#5CC6B8] focus:ring-offset-1 transition duration-150 ease-in-out text-base disabled:opacity-50"
                        onClick={handleSubmit} 
                        disabled={isLoading} // 요청 중일 때 비활성화
                    >
                        {isLoading ? '등록 중...' : '등록'} {/* 로딩 상태 표시 */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostPage;
