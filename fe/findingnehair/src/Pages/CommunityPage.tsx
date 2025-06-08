import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunityList } from "../store/communityStore";
import LoadingAnimation from "../components/ui/LoadingAnimation";
import CommunityItem from "../components/Features/community/CommunityItem";
import Pagination from "../components/ui/Pagenation"; // Pagination 컴포넌트 import

// 게시글 인터페이스 정의 (서버 응답에 맞게 수정)
interface Post {
  boardId: number;
  createAt: string;
  title: string;
  userId: string;
  content: string;
  userNickName: string;
}

// 서버 응답 인터페이스 정의
interface CommunityResponse {
  content: Post[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useCommunityList(currentPage);

  
  const moveCreatePage = () => {
    navigate("/posts/create");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading)
    return (
      <div className="flex flex-col w-md min-h-screen mx-auto bg-[#F2F6F5] rounded-t-3xl p-4">
        <div className="flex items-center p-4">
        <button
          onClick={() => navigate(-1)}
          className="text-4xl mr-2 cursor-pointer"
        >
          ‹
        </button>
        <h1 className="text-xl font-bold text-center w-full">커뮤니티</h1>
      </div>
        <LoadingAnimation loading={true} text="게시글을 불러오고 있어요" />
      </div>
    ); // 로딩 중 표시

  // data가 CommunityResponse 타입인지 확인
  const communityData = data as CommunityResponse;

  return (
    <div className="flex flex-col w-full max-w-md min-h-screen mx-auto bg-[#F2F6F5] p-4 rounded-t-3xl">
    {/* <div className="flex flex-col w-md min-h-screen mx-auto bg-[#F2F6F5] rounded-t-3xl p-4 "> */}
      {/* 헤더 */}
      <div className="flex items-center p-4">
        <button
          onClick={() => navigate(-1)}
          className="text-4xl mr-2 cursor-pointer"
        >
          ‹
        </button>
        <h1 className="text-xl font-bold text-center w-full">커뮤니티</h1>
      </div>
      <p className="text-center font-semibold text-gray-500 mb-6">
        다양한 이야기를 나누어보세요!
      </p>
      <hr className="border-1 border-gray-300" />

      {/* 글쓰기 버튼 */}
      <div className="flex justify-end mt-4">
        <button
          className="w-[85px] bg-[#5CC6B8] text-white text-lg font-semibold p-1 rounded-md shadow-lg hover:bg-[#48A79A]"
          onClick={moveCreatePage}
        >
          글쓰기
        </button>
      </div>

      {/* 게시글 목록 */}
      {communityData?.content && communityData.content.length > 0 ? (
        <div>
          {communityData.content.map((post) => (
            <CommunityItem key={post.boardId} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">작성한 게시글이 없습니다.</p>
      )}

      {/* 페이지네이션 컴포넌트 사용 */}
      <Pagination
        currentPage={currentPage}
        totalPages={communityData?.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CommunityPage;
