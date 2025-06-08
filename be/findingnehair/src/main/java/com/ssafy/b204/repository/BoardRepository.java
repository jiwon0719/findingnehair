package com.ssafy.b204.repository;

import com.ssafy.b204.board.dto.BoardDto;
import com.ssafy.b204.entity.Board;
import com.ssafy.b204.entity.UserInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Integer> {

    /**
     * 게시글 전체 가져오기
     * @return
     */
    @Query("SELECT new com.ssafy.b204.board.dto.BoardDto(" +
            "b.boardId, b.createAt, b.title, b.userInfo.userId, b.content) " +
            "FROM Board b")
    List<BoardDto> findAllBoardDtos();


    /**
     * 게시글 가져오기 페이지네이션
     * @param pageable
     * @return
     */
    @Query(
            value = "SELECT new com.ssafy.b204.board.dto.BoardDto(" +
                    "b.boardId, b.createAt, b.title, u.userId, b.content, u.userNickname) " +
                    "FROM Board b JOIN b.userInfo u",
            countQuery = "SELECT COUNT(b) FROM Board b"
    )
    Page<BoardDto> findAllBoardDtos(Pageable pageable);

    @Query("SELECT new com.ssafy.b204.board.dto.BoardDto(" +
            "b.boardId, b.createAt, b.title, b.userInfo.userId, b.content) " +
            "FROM Board b WHERE b.title LIKE %:title% ORDER BY b.userInfo.userId ASC")
    List<BoardDto> findBoardByTitle(@Param("title") String title);

    /**
     * 내가 작성한 게시글 리스트 가져오기(페이지네이션 적용)
     * @param user
     * @param pageRequest
     * @return
     */
    Page<Board> findByUserInfo(UserInfo user, PageRequest pageRequest);

    /**
     * 게시글 가져오기
     * @param id
     * @return
     */
    @Query("SELECT b FROM Board b JOIN FETCH b.userInfo WHERE b.boardId = :id")
    Optional<Board> findWithUserInfoById(@Param("id") int id);

    void deleteAllByUserInfo(UserInfo userInfo);
}