// src/pages/DiagnosisPage.tsx
import React, { useEffect, useState } from 'react';
import CommonButton from '../components/ui/CommonButton';
import FuntionCard from '../components/ui/FuntionCard';
import { FaImage } from 'react-icons/fa';
import { useMoveMain } from '../hooks/useMoveMain';
import useImageUpload from '../hooks/useImageUpload'; // 훅 임포트
import { useNavigate } from 'react-router-dom';


const DiagnosisPage: React.FC = () => {
    const movemain = useMoveMain();
    const navigate = useNavigate();

    // useImageUpload 훅 사용: 필요한 함수들을 가져옵니다.
    const { handleImageUpload } = useImageUpload();

    // 선택/처리된 이미지 데이터(Base64)를 저장할 상태
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    // const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리 필요 시
    // const [error, setError] = useState<string | null>(null); // 에러 상태 관리 필요 시

    // selectedImage 상태가 변경되면 Check 페이지로 이동
    useEffect(() => {
        if (selectedImage) {
            console.log("Check 페이지로 이동 (이미지 포함)...");

            navigate(`/diagnosis/check`, { state: { image: selectedImage } });
            // 선택적: 이동 후 상태 초기화
            // setSelectedImage(null);
        }
    }, [selectedImage, navigate]);

    // 파일 입력 변경 시 호출될 핸들러
    const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // setIsLoading(true); // 로딩 시작
        // setError(null);
        try {
            // useImageUpload 훅에서 가져온 handleImageUpload 함수 호출
            const imageData = await handleImageUpload(event);

            if (imageData) {
                // 성공 시, 컴포넌트의 상태 업데이트 -> useEffect 트리거
                setSelectedImage(imageData);
            } else {
                // 파일이 선택되지 않았거나 처리 중 문제가 있었을 경우
                setSelectedImage(null); // 상태 초기화
                // setError('이미지를 처리할 수 없습니다.');
            }
        } catch (err) {
            console.error("이미지 처리 중 에러 발생:", err);
            setSelectedImage(null); // 에러 시 상태 초기화
            // setError('이미지 처리 중 오류가 발생했습니다.');
        } finally {
            // setIsLoading(false); // 로딩 종료
        }
    };

    // 돌아가기 버튼 클릭 시
    const handleGoBack = () => {
        setSelectedImage(null); // 컴포넌트 상태 직접 리셋
        movemain(); // 메인 페이지로 이동
    };

    return (
        <div className="flex flex-col w-full max-w-md mx-auto justify-center p-4 pb-24">
            <div className="flex items-center p-3">
                <button onClick={() => navigate(-1)} className="ml-1 mt-1 text-4xl cursor-pointer">‹</button>
                <h1 className="text-xl font-bold text-center w-full">두피 진단</h1>
            </div>
            <div className='flex flex-col items-center justify-center'>
                <img src="/diagnosis/ai.png" alt="ai" className="w-24 h-24 mt-6 mb-10" />
                <div className='text-center text-gray-700 text-base font-semibold w-4/5'>
                    AI가 9만건의 데이터를 분석해, <br/> 당신의 두피 상태를 진단해 드려요.
                </div>
            </div>
            <div className="mt-12 space-y-4 w-full">
                {/* 카드 클릭 시 숨겨진 input 트리거 */}
                <FuntionCard
                    icon={<FaImage size={28} />}
                    title="사진으로 진단받기"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                />
                {/* 숨겨진 파일 입력 요소 */}
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={onFileSelect} // 변경 시 onFileSelect 핸들러 호출
                    style={{ display: 'none' }}
                />
                {/* 로딩/에러 상태 표시 (필요 시) */}
                {/* {isLoading && <p>이미지 처리 중...</p>} */}
                {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

                <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-md max-w-md px-0.5">
                    {/* 돌아가기 버튼에 handleGoBack 연결 */}
                    <CommonButton text="돌아가기" size='max' onClick={handleGoBack} />
                </div>
            </div>
        </div>
    );
};

export default DiagnosisPage;
