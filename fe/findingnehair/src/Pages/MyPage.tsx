import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateMyInfo } from "../api/mypageapi.ts";
import useUserStore from "../store/userStore.ts";
import Swal from "sweetalert2";
import { useDeleteMyAccount } from "../hooks/useMypage"; 

const MyPage: React.FC = () => {

    const dummyUser = {
      userEmail: "dummy@example.com",
      userImgUrl: "/Generic avatar.png",
      userNickname: "더미유저",
      userId: 0,
    };

    const navigate = useNavigate(); 
    const user = useUserStore((state) => state.myProfile) || dummyUser;
    const token = useUserStore((state) => state.authToken);
    const getMyProfile = useUserStore((state) => state.getMyProfile);
    // email, profileimage, nickname 세개
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewname] = useState<string>(user.userNickname);

    const handleSave = async () => {
      // 닉네임 유효성 검사 추가
      if (!newName.trim()) {
        Swal.fire({
          icon: "warning",
          title: "닉네임을 입력해주세요.",
          confirmButtonColor: "#5CC6B8",
          confirmButtonText: "확인",
          width: "450px",
          background: "#f8f9fa",
          customClass: {
          icon: "custom-icon",
          title: "custom-title",
          }
        });
        return;
      }
    
      // if (newName.length < 2 || newName.length > 20) {
      //   Swal.fire({
      //     icon: "warning",
      //     title: "닉네임은 2자 이상 20자 이하여야 합니다.",
      //   });
      //   return;
      // }
    
      try {
        const res = await updateMyInfo(newName);
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "닉네임 수정 완료",
            text: "닉네임이 성공적으로 수정되었습니다.",
            confirmButtonColor: "#5CC6B8",
            confirmButtonText: "확인",
            width: "450px",
            background: "#f8f9fa",
            customClass: {
              title: "custom-title",
            }
          }).then(() => {
            getMyProfile(token);
            navigate("/mypage");
            setIsEditingName(false);
          });
        } 
      } catch (error) {
        console.log(error);
        
        Swal.fire({
          icon: "error",
          title: "프로필 수정 실패",
          text: "닉네임 수정에 실패했습니다. 다시 시도해주세요.",
          confirmButtonColor: "#5CC6B8",
          confirmButtonText: "확인",
          width: "450px",
          background: "#f8f9fa",
          customClass: {
            title: "custom-title",
          }
        });
      }
    };
    

    const deleteMutation = useDeleteMyAccount();

    const handleDeleteAccount = () => {
      Swal.fire({
        title: "정말 탈퇴하시겠습니까?",
        text: "탈퇴 후에는 모든 정보가 삭제됩니다.",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#bbb",
        confirmButtonText: "탈퇴",
        cancelButtonText: "취소",
        confirmButtonColor: "#5CC6B8",
        width: "450px",
        background: "#f8f9fa",
        customClass: {
          icon: "custom-icon",
          title: "custom-title",
        }
      }).then((result) => {
        if (result.isConfirmed) {
          deleteMutation.mutate(); // 탈퇴 mutation 실행
        }
      });
  };

    return (
<div className="flex flex-col w-full max-w-md min-h-screen mx-auto bg-[#F2F6F5] p-4 rounded-t-3xl">
{/* 헤더 */}
            <div className="flex items-center p-4">
                <button onClick={() => navigate(-1)} className="text-4xl mr-2 cursor-pointer">‹</button>
                <h1 className="text-xl font-bold text-center w-full">마이페이지</h1>
            </div>

            {/* 회원정보 */}
            <div className="bg-white border border-gray-300 shadow-md rounded-xl h-[220px] flex flex-col items-center justify-center mt-4 text-center gap-5 relative">
              {/* 프로필 이미지 */}
              <img
                src={user.userImgUrl || "/Generic avatar.png"}
                alt="프로필 이미지"
                className="w-22 h-22 bg-[#5CC6B8] rounded-full object-cover"
              />

              {/* 닉네임 & 수정 */}
              <div className="flex items-center gap-2 mt-2">
                {isEditingName ? (
                  <>
                    <input
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-[150px]"
                      value={newName}
                      onChange={(e) => {
                        setNewname(e.target.value);
                      }}
                      placeholder="닉네임"
                    />
                    <button
                      className="text-xs px-2 py-1 bg-[#5CC6B8] text-white rounded font-semibold cursor-pointer"
                      onClick={handleSave}
                    >
                      저장
                    </button>
                    <button
                      className="text-xs px-2 py-1 bg-gray-300 text-white rounded font-semibold cursor-pointer"
                      onClick={() => {
                        setIsEditingName(false);
                        setNewname(user.userNickname);
                      }}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-xl font-semibold">{user.userNickname}</span>
                    <button
                      className="text-sm text-gray-500 hover:text-[#5CC6B8] cursor-pointer"
                      onClick={() => {
                        setIsEditingName(true);
                      }}
                    >
                      <img src="edit-button.png" className="w-4 inline-block mr-1" />
                    </button>
                  </>
                )}
              </div>
            </div>

              {/* 탈퇴 */}
              <p className="text-sm text-gray-400 text-right mt-8 mb-4"> 
                  <span className="cursor-pointer hover:text-red-500"
                  onClick={handleDeleteAccount}
                  >탈퇴하기</span>
              </p>
              <hr className="border-1 border-gray-300" />

              {/* 메뉴 목록 */}
              <div>
                  <MenuItem title="찜한 상품" onClick={() => navigate("/mypage/favorites")} />
                  <MenuItem title="내 최근 진단" onClick={() => navigate("/dashboard")} />
                  <MenuItem title="작성 게시글 관리" onClick={() => navigate("/mypage/posts")} />
              </div>
            </div>
          );
        };

const MenuItem: React.FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
    <div
        className="flex justify-between items-center py-6 px-4 border-b border-gray-300 cursor-pointer hover:bg-[#ECF1EF]"
        onClick={onClick}
    >
        <span className="text-md font-semibold">{title}</span>
        <span className="text-gray-400 text-4xl">›</span>
    </div>
);

export default MyPage;
