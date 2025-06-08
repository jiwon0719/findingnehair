import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded bg-white disabled:opacity-50 disabled:bg-none cursor-pointer disabled:cursour-none"
      >
        이전
      </button>
      <div className="flex items-center bg-white">
        <span className="px-4 py-2 border rounded">{currentPage}</span>
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 border rounded bg-white disabled:opacity-50 cursor-pointer disabled:cursour-none disabled:bg-none"
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;