import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import LoadingAnimation from "../components/ui/LoadingAnimation";
import { useCommunityDetail, useDeleteCommunity } from '../store/communityStore';
import { useTimeConvert } from "../hooks/useTimeConvert";
import useUserStore from "../store/userStore";
import axiosInstance from "../api/axiosInstance";
import { CommentType } from "../types/CommunityTypes";
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import Swal from 'sweetalert2';

const PostDetail: React.FC = () => {
    const userId = useUserStore((state) => state.myProfile?.userId);

    const isAuthor = (authorId: number) => {
        console.log(authorId, userId);
        return userId === authorId;
    }

    const navigate = useNavigate();
    const { id: boardIdParam } = useParams<{ id: string }>();
    const boardId = parseInt(boardIdParam || '0', 10);
    const user = useUserStore((state) => state.myProfile)

    const {
        data: post,
        isLoading: isPostLoading,
        isError: isPostError,
        error: postError
    } = useCommunityDetail(boardId);

    const convertedPostDate = useTimeConvert(post?.createAt);

    const [comments, setComments] = useState<{ userId: number; replyId: number; boardId: number; createAt: string; replyContent: string; userNickName:string; }[]>([]);
    const [areCommentsLoading, setAreCommentsLoading] = useState(false);
    const [isCommentsError, setIsCommentsError] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editedContent, setEditedContent] = useState("");

    const handleStartEdit = (id: number, content: string) => {
        setEditingCommentId(id);
        setEditedContent(content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditedContent("");
    };

    const convertTime = (timeString: string | undefined | null) => {
      if (!timeString) {
          return '알 수 없음';
      }

      try {
          const now = new Date();
          const date = parseISO(timeString); // ISO 8601 형식 파싱
          
          const diff = now.getTime() - date.getTime();
          console.log(diff);
          
          if (diff < 0) {
              return '알 수 없음';
          }

          if (diff < 1000 * 60) {
              return '방금 전';
          }

          if (diff < 1000 * 60 * 60) {
              return formatDistanceToNow(date, { addSuffix: true, locale: ko });
          }

          if (diff < 1000 * 60 * 60 * 24) {
              return formatDistanceToNow(date, { addSuffix: true, locale: ko });
          }

          return format(date, 'yyyy-MM-dd');
      } catch (error) {
          console.error('Invalid time string:', timeString, error);
          return '알 수 없음';
      }
    } // useTimeConvert를 사용하여 변환된 시간 문자열을 반환합니다.

    const handleAddComment = async () => {
        if (!newComment.trim() || !user) return;

        try {
            await axiosInstance.post("/reply/create", {
                boardId,
                userId: user.userId,
                replyContent: newComment,
            });

            setNewComment("");
            const refreshed = await axiosInstance.get(`/reply/list/${boardId}`);
            const commentsWithConvertedDate = refreshed.data.map((comment: CommentType) => ({
                ...comment,
                createAt: convertTime(comment.createAt),
            }));
            setComments(commentsWithConvertedDate);
        } catch (err) {
            console.error("댓글 작성 실패:", err);
        }
    };

    const handleDeleteComment = async (id: number) => {
        try {
            await axiosInstance.delete(`/reply/delete/${id}`);
            const refreshed = await axiosInstance.get(`/reply/list/${boardId}`);
            const commentsWithConvertedDate = refreshed.data.map((comment: CommentType) => ({
                ...comment,
                createAt: convertTime(comment.createAt),
            }));
            setComments(commentsWithConvertedDate);
        } catch (err) {
            console.error("댓글 삭제 실패:", err);
        }
    };

    const handleUpdateComment = async (id: number) => {
        if (!editedContent.trim()) return;
        try {
            await axiosInstance.put(`/reply/update/${id}`, {
                replyContent: editedContent,
                boardId: boardId,
            });

            setEditingCommentId(null);
            setEditedContent("");
            const refreshed = await axiosInstance.get(`/reply/list/${boardId}`);
            const commentsWithConvertedDate = refreshed.data.map((comment: CommentType) => ({
                ...comment,
                createAt: convertTime(comment.createAt),
            }));
            setComments(commentsWithConvertedDate);
        } catch (err) {
            console.error("댓글 수정 실패:", err);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            setAreCommentsLoading(true);
            setIsCommentsError(false);
            try {
                const res = await axiosInstance.get(`/reply/list/${boardId}`);
                const commentsWithConvertedDate = res.data.map((comment: CommentType) => ({
                    ...comment,
                    createAt: convertTime(comment.createAt),
                }));
                setComments(commentsWithConvertedDate);
            } catch (err) {
                console.error("댓글 불러오기 실패:", err);
                setIsCommentsError(true);
            } finally {
                setAreCommentsLoading(false);
            }
        };

        fetchComments();
    }, [boardId]);

    const {
        mutate: deletePost,
        isLoading: isDeleting
    } = useDeleteCommunity();

    const handleDelete = () => {
        if (!boardId) return;

        if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            deletePost(boardId, {
                onSuccess: () => {
                    Swal.fire({
                        icon: "success",
                        title: "게시글 삭제 완료",
                        text: "게시글이 삭제되었습니다.",
                        confirmButtonColor: "#5CC6B8",
                        confirmButtonText: "확인",
                        width: "450px",
                        background: "#f8f9fa",
                        customClass: {
                          // icon: "custom-icon",
                          title: "custom-title",
                        }
                });
                    navigate('/community', { replace: true });
                },
                onError: (err) => {
                    console.error("게시글 삭제 중 오류 발생:", err);
                    Swal.fire({
                        title: '게시글 삭제 실패',
                        text: err instanceof Error ? err.message : '게시글 삭제 중 오류가 발생했습니다.',
                        icon: 'error',
                        confirmButtonColor: "#5CC6B8",
                        confirmButtonText: "확인",
                        width: "450px",
                        background: "#f8f9fa",
                        customClass: {
                        title: "custom-title",
                        }
                    });
                    // alert(`게시글 삭제 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
                }
            });
        }
    };

    const handleEdit = () => {
        if (!boardId) return;
        navigate(`/community/edit/${boardId}`, { state: { boardId } });
    };

    if (isPostLoading) {
        return (
            <div className="flex items-center w-[445px] justify-center">
                <LoadingAnimation loading={true} text="게시글 정보를 불러오는 중..."></LoadingAnimation>
            </div>
        );
    }

    if (isPostError || !post) {
        console.error("게시글 로딩 에러:", postError);
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>게시글 정보를 불러오는데 실패했거나 게시글이 없습니다.</p>
                <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
                    뒤로가기
                </button>
            </div>
        );
    }

    return (
<div className="flex flex-col w-full max-w-md min-h-screen mx-auto bg-[#F2F6F5] p-4 rounded-t-3xl">
{/* 헤더 */}
            <div className="flex items-center p-4">
                <button onClick={() => navigate(-1)} className="text-4xl mr-2 cursor-pointer focus:outline-none">‹</button>
                <h1 className="text-xl font-bold text-center w-full">커뮤니티</h1>
            </div>

            {/* 게시글 내용 */}
            <div className="border border-gray-300 rounded-lg p-4 mt-5 mb-4 bg-white">
                {/* 제목 및 작성자 정보 + 수정/삭제 버튼 */}
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-md text-left font-semibold mt-2 ml-2">{post.title}</h2>
                        <p className="text-sm text-left text-gray-500 mt-1 ml-2">{post.userNickName || '작성자 없음'} | {convertedPostDate || '날짜 없음'}</p>
                    </div>
                    {/* 수정/삭제 버튼 영역 */}
                    {isAuthor(post.userId) && (
                        <div className="flex space-x-2 mt-2 mr-1">
                            <button
                                onClick={handleEdit}
                                className="text-gray-600 hover:text-[#5CC6B8] p-1 disabled:opacity-50"
                                title="수정"
                                disabled={isDeleting}
                            >
                                <FiEdit size={18} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-gray-600 hover:text-red-500 p-1 disabled:opacity-50"
                                title="삭제"
                                disabled={isDeleting}
                            >
                                {isDeleting ? '삭제중...' : <FiTrash2 size={18} />}
                            </button>
                        </div>
                    )}

                </div>

                <hr className="border-gray-300 my-2 mt-4" />
                {/* Markdown 렌더링 영역 */}
                <div className="prose prose-sm max-w-none mt-4 mb-3 px-2 text-left ml-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                </div>
                {/* 이미지 처리 (API 응답 확인 필요) */}
                {/* {post.image && <img src={post.image} alt="게시글 이미지" className="mt-4 w-full h-auto max-h-60 object-contain rounded-md" />} */}
            </div>

            {/* 댓글 섹션 */}
            <div className="rounded-lg border border-gray-300 p-4 mt-5 bg-white">
                <p className="text-md font-semibold text-[#5CC6B8] flex items-center mt-2 mb-5 ml-2">
                    💬 {comments.length}개
                </p>
                {/* 댓글 작성 폼 */}
                <div className="mt-6 flex flex-col gap-2">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요."
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        rows={3}
                    />
                    <button
                        onClick={handleAddComment}
                        className="self-end bg-[#5CC6B8] hover:bg-[#48A79A] text-white text-sm font-semibold py-1 px-4 rounded shadow"
                    >
                        댓글 작성
                    </button>
                </div>

                <hr className="border-gray-300 my-2" />

                {/* 댓글 로딩/에러 처리 (useEffect 방식에 맞게 수정) */}
                {/* {areCommentsLoading && <p className="text-center text-gray-500 py-4">댓글을 불러오는 중...</p>}
                {isCommentsError && <p className="text-center text-red-500 py-4">댓글을 불러오는데 실패했습니다.</p>} */}

                {!areCommentsLoading && !isCommentsError && (
                    comments.length > 0 ? (
                        <>
                            {comments.map((comment) => {
                                const isMine = user?.userId === comment.userId;
                                const isEditing = editingCommentId === comment.replyId;
                                return (
                                    <div key={comment.replyId} className="border-b border-gray-200 last:border-b-0 py-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-semibold ml-2">
                                                {comment.userNickName || "익명"}
                                            </p>
                                            {isMine && (
                                                <div className="flex gap-2 text-sm text-gray-500 mr-2">
                                                    {isEditing ? (
                                                        <>
                                                            <button onClick={() => handleUpdateComment(comment.replyId)} className="text-green-600 font-bold cursor-pointer">저장</button>
                                                            <button onClick={handleCancelEdit} className="cursour-pointer">취소</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button className="cursor-pointer" onClick={() => handleStartEdit(comment.replyId, comment.replyContent)} >수정</button>
                                                            <button onClick={() => handleDeleteComment(comment.replyId)} className="text-red-500 cursor-pointer">삭제</button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="prose prose-sm max-w-none mt-2 mb-1 px-2 text-left ml-3">
                                            {isEditing ? (
                                                <textarea
                                                    value={editedContent}
                                                    onChange={(e) => setEditedContent(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md p-1 text-sm"
                                                    rows={3}
                                                />
                                            ) : (
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {comment.replyContent || ""}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <p className="text-center text-gray-500 py-4">작성된 댓글이 없습니다.</p>
                    )
                )}
            </div>

            {/* 댓글 작성 폼 (여기에 추가하거나 분리) */}
            {/* <CommentForm postId={boardId} /> */}
        </div>
    );
};

export default PostDetail;