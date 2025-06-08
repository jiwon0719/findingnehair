package com.ssafy.b204.mypage.service;

import com.ssafy.b204.entity.Board;
import com.ssafy.b204.entity.UserInfo;
import com.ssafy.b204.entity.UserScalp;
import com.ssafy.b204.mypage.dto.BoardsResponseDto;
import com.ssafy.b204.mypage.dto.UserInfoResponseDto;
import com.ssafy.b204.mypage.dto.UserScalpDto;
import com.ssafy.b204.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MypageService {

    private final UserRepository userRepository;
    private final UserTokenRepository userTokenRepository;
    private final UserScalpRepository userScalpRepository;
    private final BoardRepository boardRepository;
    private final ReplyRepository replyRepository;
    private final ProductFavoriteRepository productFavoriteRepository;
    private final TokenBlackListRepository tokenBlackListRepository;


    @Transactional
    public void updateNickname (String userId, String newNickname) {
        UserInfo user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        user.setUserNickname(newNickname);
    }

    @Transactional
    public void deleteUser(String userId) {
        UserInfo user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        replyRepository.deleteAllByUserInfo(user);
        boardRepository.deleteAllByUserInfo(user);
        userScalpRepository.deleteAllByUserInfo(user);
        productFavoriteRepository.deleteAllByUserInfo(user);
        tokenBlackListRepository.deleteAllByUserInfo(user);
        userTokenRepository.findByUserInfo(user)
                .ifPresent(userTokenRepository::delete);
        userRepository.delete(user);
    }


    @Transactional(readOnly = true)
    public Page<UserScalpDto> getScalpHistory(String userId, int page, int size) {
        UserInfo user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Page<UserScalp> scalpPage = userScalpRepository.findAllByUserInfo(user, PageRequest.of(page, size));

        return scalpPage.map(scalp -> UserScalpDto.builder()
                .scalpImgUrl(scalp.getScalpImgUrl())
                .scalpDiagnosisDate(scalp.getScalpDiagnosisDate())
                .scalpDiagnosisResult(scalp.getScalpDiagnosisResult())
                .microKeratin(scalp.getMicroKeratin())
                .excessSebum(scalp.getExcessSebum())
                .follicularErythema(scalp.getFollicularErythema())
                .follicularInflammationPustules(scalp.getFollicularInflammationPustules())
                .dandruff(scalp.getDandruff())
                .hairLoss(scalp.getHairLoss())
                .build());
    }

    @Transactional
    public ResponseEntity<UserInfoResponseDto> getUserInfo(String userId) {
        UserInfo user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        UserInfoResponseDto responseDto = UserInfoResponseDto.builder()
                .userId(user.getUserId())
                .userNickname(user.getUserNickname())
                .userImgUrl(user.getUserImgUrl())
                .build();

        return ResponseEntity.ok(responseDto);
    }

    @Transactional(readOnly = true)
    public Page<BoardsResponseDto> getUserBoards(String userId, int page, int size) {
        UserInfo user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Page<Board> boardPage = boardRepository.findByUserInfo(user, PageRequest.of(page, size));

        return boardPage.map(board -> BoardsResponseDto.builder()
                .boardId(board.getBoardId())
                .title(board.getTitle())
                .content(board.getContent())
                .createAt(board.getCreateAt())
                .build());
    }
}
