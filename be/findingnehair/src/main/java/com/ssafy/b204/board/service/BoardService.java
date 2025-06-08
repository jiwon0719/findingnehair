package com.ssafy.b204.board.service;

import com.ssafy.b204.board.dto.BoardDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface BoardService {

    /** 게시글 작성 */
    BoardDto createBoard(BoardDto boardDetailDto);

    /** 게시글 리스트 조회 */
    List<BoardDto> getAllBoards();

    /** 게시글 리스트 조회 (페이지네이션) */
    Page<BoardDto> getBoardsByPage(int page , int limit);

    /** 게시글 상세 조회 */
    BoardDto getBoardById(int id);

    /** 게시글 수정 */
    BoardDto updateBoard(int id, BoardDto boardDetailDto);

    /** 게시글 삭제 */
    void deleteBoard(String userId, int id);

    /** 제목으로 검색 */
    List<BoardDto> searchByTitle(String title);


}
