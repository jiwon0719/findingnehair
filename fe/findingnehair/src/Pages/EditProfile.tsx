import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


const EditProfile: React.FC = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<{ name: string; profileImg?: string }>({
        name: "ff",
        profileImg: "",
    });

    // 로컬스토리지에서 현재 사용자 정보 불러오기
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser.name) {
            setUser(storedUser);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem("user", JSON.stringify(user));
        Swal.fire({
            icon: "success",
            title: "정보 수정 완료",
            text: "정보가 수정되었습니다.",
            confirmButtonColor: "#5CC6B8",
            confirmButtonText: "확인",
            width: "450px",
            background: "#f8f9fa",
            customClass: {
              title: "custom-title",
            }
	});
        navigate("/mypage");
    };

    return (
        <div className="flex flex-col w-[445px] max-w-md min-h-screen mx-auto bg-[#F2F6F5] p-4">
            {/* 헤더 */}
            <div className="flex items-center p-4">
                <button onClick={() => navigate(-1)} className="text-4xl mr-2 cursor-pointer">‹</button>
                <h1 className="text-xl font-bold text-center w-full">회원정보 수정</h1>
            </div>

            {/* 입력 폼 */}
            <div className="bg-white p-6 rounded-xl shadow mt-6 space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">이름</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">프로필 이미지 URL</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded p-2"
                        value={user.profileImg}
                        onChange={(e) => setUser({ ...user, profileImg: e.target.value })}
                    />
                </div>
                <button
                    onClick={handleSave}
                    className="w-full bg-[#5CC6B8] text-white py-2 rounded font-semibold hover:bg-[#48A79A]"
                >
                    저장하기
                </button>
            </div>
        </div>
    );
};

export default EditProfile;
