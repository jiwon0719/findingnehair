import { useQuery, useMutation, useQueryClient } from "react-query";
import { getCommunityList, getCommunityDetail, postCommunity, putCommunity, deleteCommunity } from "../api/comunityapi"; // API 호출 함수 import
import { getComments, createComment, updateComment, deleteComment } from '../api/comunityapi';

//1. 전체 게시글 조회 (페이지네이션)


export const useCommunityList = (page: number) => {
    return useQuery(["communityList", page], () => getCommunityList(page), {
        keepPreviousData: true, // 이전 데이터 유지: 누를때 로딩창 보이기 최소화
    });
}
//2. 단일 게시글 조회 
export const useCommunityDetail = (id: number) => {
  return useQuery(["communityDetail", id], () => getCommunityDetail(id), {
    enabled: !!id, //id가 존재할 때에만 이 쿼리를 사용한다는 뜻
  });
};
//3. 글 작성: 성공시 커뮤니티리스트 쿼리 불러옴
export const usePostCommunity = () => { 
  const queryClient = useQueryClient();
  return useMutation((data: object) => postCommunity(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["communityList"]);
    },
  });
};
//4. 글 수정: useMutation 사용, 성공시 상세페이지와 리스트 페이지 캐시 무효화
export const usePutCommunity = () => {
    const queryClient = useQueryClient();
    return useMutation(({ boardId, data }: { boardId: number; data: object }) => putCommunity(boardId, data), {
      onSuccess: (variables) => { // variables (boardId) 추가
        // 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: ["communityList"] });
        // 삭제된 게시글의 상세 정보 캐시 제거
        queryClient.removeQueries({ queryKey: ["communityDetail", variables] }); // variables가 boardId 자체
    },
    });
  };
  
//5. 글 삭제: useMutation 사용, 성공시 리스트 페이지 캐시 무효화
export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation((boardId: number) => deleteCommunity(boardId), {
    onSuccess: (variables) => {
      queryClient.invalidateQueries(["communityList"]); // 목록 페이지 캐시 무효화: 삭제된 게시글이 반영된 목록을 다시 불러오도록 함3
      queryClient.removeQueries({ queryKey: ["communityDetail", variables] }); // variables가 boardId 자체
    },
  });
};

// 댓글 목록 조회
export const useComments = (boardId: number) => {
  return useQuery(['comments', boardId], () =>
    getComments(boardId).then((res) => res.data)
  );
};

// 댓글 작성
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, content }: { boardId: number; content: string }) =>
      createComment(boardId, content),
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries(['comments', boardId]);
    },
  });
};

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ replyId, content }: { replyId: number; content: string }) =>
      updateComment(replyId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    },
  });
};

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (replyId: number) => deleteComment(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    },
  });
};