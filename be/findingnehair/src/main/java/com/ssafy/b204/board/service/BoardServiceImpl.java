package com.ssafy.b204.board.service;

import com.ssafy.b204.board.dto.BoardDto;
import com.ssafy.b204.entity.Board;
import com.ssafy.b204.entity.UserInfo;
import com.ssafy.b204.repository.BoardRepository;
import com.ssafy.b204.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService{

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    /**
     * 게시글 작성
     *
     * @param boardDto
     * @return
     */
    @Override
    @Transactional
    public BoardDto createBoard(BoardDto boardDto) {
        UserInfo user = userRepository.findByUserId(boardDto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

        Board board = Board.builder()
                .userInfo(user)
                .title(boardDto.getTitle())
                .content(boardDto.getContent())
                .createAt(LocalDateTime.now())
                .build();

        Board saved = boardRepository.save(board);

        return new BoardDto(
                saved.getBoardId(),
                saved.getCreateAt(),
                saved.getTitle(),
                saved.getUserInfo().getUserId(),
                saved.getContent(),
                saved.getUserInfo().getUserNickname()
        );
    }


    /**
     * 게시글 리스트 조회
     * @return
     */
    @Override
    public List<BoardDto> getAllBoards() {
        return boardRepository.findAllBoardDtos();
    }

    /**
     * 게시글 리스트 조회 (페이지네이션)
     * @param page
     * @param limit
     * @return
     */
    @Override
    public Page<BoardDto> getBoardsByPage(int page ,int limit) {
        Pageable pageable = PageRequest.of(page-1, limit, Sort.by(Sort.Direction.DESC, "boardId"));
        return boardRepository.findAllBoardDtos(pageable);
    }

    /**
     * 게시글 상세 조회
     * @param boardId
     * @return
     */
    @Override
    public BoardDto getBoardById(int boardId) {
        Board board = boardRepository.findWithUserInfoById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        return new BoardDto(
                board.getBoardId(),
                board.getCreateAt(),
                board.getTitle(),
                board.getUserInfo().getUserId(),
                board.getContent(),
                board.getUserInfo().getUserNickname()
        );
    }

    /**
     * 게시글 수정
     * @param boardId
     * @param boardDto
     * @return
     */
    @Override
    @Transactional
    public BoardDto updateBoard(int boardId, BoardDto boardDto) {
        //게시글이 있는지 확인
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        //작성자가 맞는지 확인
        if (!board.getUserInfo().getUserId().equals(boardDto.getUserId())) {
            throw new RuntimeException("수정할 수 있는 사용자가 아닙니다.");
        }

        board.setTitle(boardDto.getTitle());
        board.setContent(boardDto.getContent());
        boardRepository.save(board);

        return new BoardDto(
                board.getBoardId(),
                board.getCreateAt(),
                board.getTitle(),
                board.getUserInfo().getUserId(),
                board.getContent(),
                board.getUserInfo().getUserNickname()
        );
    }

    /**
     * 게시글 삭제
     * @param id
     */
    @Override
    public void deleteBoard(String userId, int id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        // 작성자를 검사해서 맞는지 확인한다.
        String writed = board.getUserInfo().getUserId();
        if(!writed.equals(userId)){
            throw new RuntimeException("삭제할 수 있는 사용자가 아닙니다.");
        }
        boardRepository.delete(board);
    }

    /**
     * 제목으로 검색
     * @param title
     * @return
     */
    @Override
    public List<BoardDto> searchByTitle(String title) {
        return boardRepository.findBoardByTitle(title);
    }

}
