import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyArticle } from "../hooks/useMypage";
import Pagination from "../components/ui/Pagenation";
import { useTimeConvert } from "../hooks/useTimeConvert";

interface Post {
    boardId: number;
    title: string;
    userId: string;
    createAt: string;
}

// interface MyPostsResponse {
//     content: Post[];
//     totalPages: number;
//     totalElements: number;
//     // ... other properties from the response if needed
// }

const MyPosts: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const { data: myPostsData } = useGetMyArticle(currentPage-1, 10);

    // Safely access the content and totalPages from the response
    const myPosts = myPostsData?.content;
    const totalPages = myPostsData?.totalPages;
    const timeConverter = useTimeConvert; // Directly use the hook function

    const hanldeChangePage = (page: number) => {
        setCurrentPage(page);
    }

    return (
<div className="flex flex-col w-full max-w-md min-h-screen mx-auto bg-[#F2F6F5] p-4 rounded-t-3xl">
{/* 헤더 */}
            <div className="flex items-center p-4">
                <button onClick={() => navigate(-1)} className="text-4xl mr-2 cursor-pointer">‹</button>
                <h1 className="text-xl font-bold text-center w-full">작성 게시글 관리</h1>
            </div>
            <p className="text-center font-semibold text-gray-500 mb-6">내가 작성한 게시글을 확인하세요!</p>
            <hr className="border-1 border-gray-300" />

            {/* 게시글 목록 */}
            <div >
                {myPosts && myPosts.length > 0 ? (
                    myPosts.map((post: Post) => (
                        <div
                            key={post.boardId}
                            className="flex justify-between items-center p-4 py-4 border-b border-gray-300 cursor-pointer hover:bg-[#ECF1EF]"
                            onClick={() => navigate(`/community/post/${post.boardId}`, { state: { post } })}
                        >
                            <div>
                                <p className="text-left text-md font-semibold mt-1">{post.title}</p>
                                <p className="text-sm text-left text-gray-500 mt-3 mb-2">
                                   {timeConverter(post.createAt)}
                                </p>
                            </div>
                            <span className="text-gray-400 text-4xl">›</span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-10">작성한 게시글이 없습니다.</p>
                )}
                {/* 페이지네이션 컴포넌트 */}
                {totalPages && totalPages > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={hanldeChangePage}
                    />
                )}
            </div>
        </div>
    );
};

export default MyPosts;
