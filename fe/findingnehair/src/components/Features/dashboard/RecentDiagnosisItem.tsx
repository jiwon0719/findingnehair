// import React from "react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiDiagnosisItem } from "../../../types/DiagnosisTypes";
import useUserStore from "../../../store/userStore";
const RecentDiagnosisItem = ({ diagnosis }: { diagnosis: ApiDiagnosisItem }) => {
    const navigate = useNavigate();
    const [showImage, setShowImage] = useState(false); // 이미지 표시 상태
    const showScalp = useUserStore((state) => state.showScalp); // showSclap 상태
    const setShowSclap = useUserStore((state) => state.setShowScalp); // showSclap 상태 설정 함수
    const image = diagnosis.scalpImgUrl; // 이미지 URL
    const data = {
        microKeratin: diagnosis.microKeratin,
        excessSebum: diagnosis.excessSebum,
        follicularErythema: 3 - diagnosis.follicularErythema,
        follicularInflammationPustules: diagnosis.follicularInflammationPustules,
        dandruff: diagnosis.dandruff,
        hairLoss: diagnosis.hairLoss,
    };

    const formattedDate = new Date(diagnosis.scalpDiagnosisDate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = new Date(diagnosis.scalpDiagnosisDate).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24시간 형식으로 표시
    });

    const handleToggleImage = (event: React.MouseEvent) => {
        event.stopPropagation(); // 클릭 이벤트가 부모 div로 전파되는 것을 방지
        setShowImage(!showImage);
    };

    return (
        <div
            onClick={() => navigate('/diagnosis/report', { state: { image, data: data } })}
            className="flex justify-between items-center w-full p-4 py-4 border-b border-gray-300 cursor-pointer hover:bg-[#ECF1EF]"
        >
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-xs overflow-hidden shadow-sm hover:brightness-75 transition duration-300 ease-in-out" 
                        onClick={handleToggleImage}>
                        {showScalp && image ? (
                            <img src={image} alt="진단 이미지" className="w-16 h-16 object-cover" />
                        ) : (
                            <img src='/character1.png' alt="대체 이미지" className="w-16 h-16 object-cover" />
                        )}
                    </div>
                </div>
                <div>
                    <p className="text-md font-semibold mt-1">{formattedDate}의 진단기록</p>
                    <p className="text-sm text-left text-gray-500 mt-3 mb-2">{formattedTime}</p>
                </div>
            </div>
            <span className="text-gray-400 text-4xl">›</span>
        </div>
    );
}

export default RecentDiagnosisItem;