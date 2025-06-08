import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";

const REST_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
// 환경변수 확인

const handleKakaoLogin = () => {
  window.location.href = KAKAO_AUTH_URL;
};


const TextCarousel: React.FC = () => {
    const settings: Settings = {
        dots: false,
        infinite: false,
        fade: true,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="relative w-full">
            <div className="text-carousel">
                <Slider {...settings}>
                    <div className="text-center">
                        <h3 className="text-xl">
                            나의 두피, 사진 한장으로 진단받기 위해
                        </h3>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl">
                            내 두피에 완벽한 샴푸를 추천받기 위해
                        </h3>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl">
                            풍성하게 내 모발과 마음을 채우기 위해
                        </h3>
                    </div>
                </Slider>
            </div>
        </div>
    );
};

const LoginPage = () => {
  return (
<div className="flex flex-col w-full max-w-md min-h-screen mx-auto bg-[#F2F6F5] p-4 rounded-t-3xl">
<div className="flex flex-col items-center mt-32">
    <img src="character1.png" className="w-38" alt="캐릭터" />
    <h1 className="text-3xl font-bold text-center mb-0 mt-4">니모를 찾아서</h1>
  </div>
        <div className="flex flex-col items-center justify-center pt-6">
            <div className="mb-45 w-full max-w-md text-[#A7A7A7]">
            <TextCarousel />
            </div>

            <div className="">
            <button
                className="hover:brightness-75 cursor-pointer shadow-sm"
                onClick={handleKakaoLogin}>
                <img src="/kakaologin.png" className="w-full" alt="Kakao Login"></img>
            </button>
            </div>
        </div>
    </div>
  );
};
export default LoginPage;
