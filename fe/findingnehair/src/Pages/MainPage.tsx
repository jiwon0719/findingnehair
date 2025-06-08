import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import {CiLogin, CiLogout } from "react-icons/ci";
const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);
    const logout = useUserStore(state => state.logout)
    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <div className="flex flex-col items-center h-screen bg-[#5CC6B8] w-full md:w-md rounded-3xl" >
            {/* 헤더 */}
            <div className="w-full h-5/12 bg-[#5CC6B8] text-white p-6 text-left rounded-3xl relative">
                {!isLoggedIn && 
                <div className="absolute top-6 right-6 cursor-pointer" onClick={handleLoginClick} role="button">
                    <CiLogin size={24} />
                </div>}
                {isLoggedIn && 
                <div className="absolute top-6 right-6 cursor-pointer" onClick={logout} role="button">
                    <CiLogout size={24} />
                </div>}
                <h1 className="text-2xl font-bold mt-10 ml-10">니모를 찾아서</h1>
                <p className="text-md font-semibold mt-2 ml-10">두피 진단을 받아보세요!</p>
                <div className="flex justify-center mt- ml-60 ">
                    <img src="/character1.png" alt="니모 캐릭터" className="h-28 w-auto object-contain" />
                </div>
            </div> 

            {/* 버튼 */}
            <div className="w-full h-12/12 bg-[#F2F6F5] p-6 rounded-t-3xl shadow-lg grid grid-cols-2 gap-4">
                <Link to="/diagnosis" className="col-span-2 flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-[#ECF1EF]" role="button" >
                    <img src="/mainPage/Activity.png" alt="두피 진단" className="h-16" />
                    <span className="text-lg font-semibold text-black">두피 진단</span>
                </Link>
                <Link to="/dashboard" className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-[#ECF1EF]" role="button" >
                    <img src="/mainPage/Layout.png" alt="최근 진단" className="h-16" />
                    <span className="text-lg font-semibold text-black">내 최근 진단</span>
                </Link>
                <Link to="/product" className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-[#ECF1EF]" role="button" >
                    <img src="/mainPage/Gift.png" alt="상품 추천" className="h-16" />
                    <span className="text-lg font-semibold text-black">상품 확인</span>
                </Link>
                <Link to="/community" className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-[#ECF1EF]" role="button" >
                    <img src="/mainPage/Coffee.png" alt="커뮤니티" className="h-16" />
                    <span className="text-lg font-semibold text-black">커뮤니티</span>
                </Link>
                <Link to="/mypage" className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-[#ECF1EF]" role="button" >
                    <img src="/mainPage/User.png" alt="마이페이지" className="h-16" />
                    <span className="text-lg font-semibold text-black">마이페이지</span>
                </Link>
            </div>
        </div>
    );
}; 

export default MainPage;
