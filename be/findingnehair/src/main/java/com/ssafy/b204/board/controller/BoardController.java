package com.ssafy.b204.board.controller;

import com.ssafy.b204.board.dto.BoardDto;
import com.ssafy.b204.board.service.BoardServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {
    private final BoardServiceImpl boardService;


    /**
     * 게시글 작성
     * @param boardDto
     * @return
     */
    @PostMapping("/create")
    public ResponseEntity<BoardDto> createBoard(HttpServletRequest request , @RequestBody BoardDto boardDto){
        String userId = (String) request.getAttribute("kakaoId");
        boardDto.setUserId(userId);
        return ResponseEntity.ok(boardService.createBoard(boardDto));
    }

    /**
     * 게시글 리스트 조회
     * @return
     */
    @GetMapping("/list")
    public ResponseEntity<List<BoardDto>> getAllBoards(){
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    /**
     * 게시판 리스트 조회 (페이지 네이션 )
     * @param page
     * @param limit
     * @return
     */
    @GetMapping("/list/{page}")
    public ResponseEntity<Page<BoardDto>> goetBoardsByPage(
            @PathVariable int page,
            @RequestParam(name = "limit", defaultValue = "10") int limit){
        return ResponseEntity.ok(boardService.getBoardsByPage(page , limit));
    }

    /**
     * 게시글 상세 조회
     * @param boardId
     * @return
     */
    @GetMapping("/detail/{boardId}")
    public ResponseEntity<BoardDto> getBoardDetailById(@PathVariable int boardId){
        return ResponseEntity.ok(boardService.getBoardById(boardId));
    }

    /**
     * 게시글 수정
     * @param boardId
     * @param boardDetailDto
     * @return
     */
    @PutMapping("/update/{boardId}")
    public ResponseEntity<BoardDto> updateBoard(HttpServletRequest request , @PathVariable int boardId , @RequestBody BoardDto boardDetailDto){
        String userId = (String) request.getAttribute("kakaoId");
        boardDetailDto.setUserId(userId);
        return ResponseEntity.ok(boardService.updateBoard(boardId , boardDetailDto));
    }

    /**
     * 게시글 삭제
     * @param boardId
     * @return
     */
    @DeleteMapping("/delete/{boardId}")
    public ResponseEntity<?> deleteBoard(HttpServletRequest request, @PathVariable int boardId){
        String userId = (String) request.getAttribute("kakaoId");
        boardService.deleteBoard(userId , boardId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 제목으로 검색
     * @param title
     * @return
     */
    @GetMapping("/searchbytitle")
    public ResponseEntity<List<BoardDto>> searchByTitle(@RequestParam String title){
        return ResponseEntity.ok(boardService.searchByTitle(title));
    }


}
