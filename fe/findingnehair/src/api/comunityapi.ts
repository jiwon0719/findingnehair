import axiosInstance from "./axiosInstance";

// 전체 목록 페이지네이션 조회
export const getCommunityList = async (page: number) => {
    const response = await axiosInstance.get(`/board/list/${page}`);
    return response.data;
};

// 상세 페이지 조회
export const getCommunityDetail = async (boardId: number) => {
    const response = await axiosInstance.get(`/board/detail/${boardId}`);
    return response.data;
}

// 글 작성
export const postCommunity = async (data: object) => {
    const response = await axiosInstance.post("/board/create", data);
    return response.data;
};

// 글 수정
export const putCommunity = async (boardId: number, data: object) => {
    const response = await axiosInstance.put(`/board/update/${boardId}`, data);
    return response.data;
}

// 글 삭제
export const deleteCommunity = async (boardId: number) => {
    const response = await axiosInstance.delete(`/board/delete/${boardId}`);
    return response.data;
}

// 댓글 조회
export const getComments = (boardId: number) =>
    axiosInstance.get(`/reply/list/${boardId}`);
  
// 댓글 작성
export const createComment = (postId: number, content: string) =>
axiosInstance.post(`/reply/create`, {
    boardId: postId,
    content,
});

// 댓글 수정
export const updateComment = (replyId: number, content: string) =>
axiosInstance.put(`/reply/update/${replyId}`, {
    content,
});

// 댓글 삭제
export const deleteComment = (replyId: number) =>
axiosInstance.delete(`/reply/delete/${replyId}`);
