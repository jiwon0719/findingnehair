// DiagnosisCheckPage.tsx
import CapturedImage from "../components/Features/diagnosis/capturedImage";
import ExampleImage from "../components/Features/diagnosis/exampleImage";
import CommonButton from "../components/ui/CommonButton"; 
import { useLocation, useNavigate } from "react-router-dom";
import { checkImage } from "../api/diagnosisapi";
import Swal from "sweetalert2";
import { useState } from "react";
import LoadingAnimation from "../components/ui/LoadingAnimation";

const dataURLtoFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

const DiagnosisCheckPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const imageUrl = location.state?.image as string; // 이미지 URL을 location에서 가져옴
    const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태 추가
    
    const handleDiagnosis = async () => {
        if (!imageUrl) {
            Swal.fire({
                title: "이미지가 없습니다.",
                text: "다시 촬영해주세요.",
                icon: "error",
                confirmButtonColor: "#5CC6B8",
                confirmButtonText: "확인",
                width: "450px",
                background: "#f8f9fa",
                customClass: {
                  title: "custom-title",
                },
              });
            return;
        }

        const file = dataURLtoFile(imageUrl, "image.jpg");

        setIsLoading(true); // 로딩 시작
        try {
            const response = await checkImage(file);
            if (response) {
                // 성공적인 응답 처리
                const data = {
                    microKeratin: response.microKeratin,
                    excessSebum: response.excessSebum,
                    follicularErythema: 3-response.follicularErythema,
                    follicularInflammationPustules: response.follicularInflammationPustules,
                    dandruff: response.excessSebdandruffum,
                    hairLoss: response.hairLoss,
                };

                navigate("/diagnosis/report", { state: { image: imageUrl, data: data } });
            } else {
                Swal.fire({
                    title: "진단 실패",
                    text: "두피 사진을 확인해주세요.",
                    icon: "error",
                    confirmButtonColor: "#5CC6B8",
                    confirmButtonText: "확인",
                    width: "450px",
                    background: "#f8f9fa",
                    customClass: {
                      title: "custom-title",
                    },
                  });
            }
        } catch (error) {
            console.error("진단 오류:", error);
            Swal.fire({
                title: "진단 실패",
                text: "두피 사진을 확인해주세요.",
                icon: "error",
                confirmButtonColor: "#5CC6B8",
                confirmButtonText: "확인",
                width: "450px",
                background: "#f8f9fa",
                customClass: {
                  title: "custom-title",
                },
              });
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    if (isLoading)
        return (
          <div className="flex flex-col w-md min-h-screen mx-auto bg-[#F2F6F5] rounded-t-3xl p-4">
            <div className="flex items-center p-4">
            <button
              onClick={() => navigate(-1)}
              className="text-4xl mr-2 cursor-pointer"
            >
              ‹
            </button>
            <h1 className="text-xl font-bold text-center w-full">두피 진단</h1>
          </div>
          <LoadingAnimation loading={true} text="최첨단 두피분류 AI가 두피를 살펴보는 중..." /> 
          </div>
        ); // 로딩 중 표시


    return (
        <div className="flex flex-col w-full max-w-md mx-auto justify-center p-4 pb-24">
            <div className="flex flex-col w-full">
                <div className="flex items-center p-3">
                    <button onClick={() => navigate(-1)} className="ml-1 mt-1 text-4xl cursor-pointer">‹</button>
                    <h1 className="text-xl font-bold text-center w-full">두피 진단</h1>
                </div>
                <h1 className="text-xl text-left mt-5 mb-5 ml-5 font-semibold">진단 이미지</h1>
                <CapturedImage imgUrl={imageUrl} />
                <h1 className="text-base mt-10 text-left text-gray-600">다음과 같은 경우 진단이 거부되거나 부정확한 결과가 나올 수 있어요.</h1>
                <div className="flex flex-row justify-center space-x-5 mt-4">
                    <ExampleImage description="관계없는 사진" imgUrl="/diagnosis/ddubuchip.jpg" />
                    <ExampleImage description="멀리서 찍은 사진" imgUrl="/diagnosis/far.png" />
                    <ExampleImage description="색조명 아래의 사진" imgUrl="/diagnosis/red light.png" />
                </div>
                <div className="flex flex-row fixed bottom-0 left-1/2 transform -translate-x-1/2 w-md max-w-md px-0.5">
                    <CommonButton text="다시 올리기" bgColor="sub" size="max" onClick={() => navigate(-1)} />
                    <CommonButton text="진단하기" bgColor="main" size="max" onClick={handleDiagnosis} />
                </div>
            </div>
        </div>
    );
};

export default DiagnosisCheckPage;
