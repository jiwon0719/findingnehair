import React, { useState } from "react"; // useState 추가
import { useLocation } from "react-router-dom";
import { usePDF } from "react-to-pdf";
import useUserStore from "../store/userStore";
import { useMoveMain } from "../hooks/useMoveMain";

// --- UI 컴포넌트 ---
import Header from "../components/Common/Header";
import Title from "../components/ui/Title";
import ScalpChart from "../components/ui/scalpChart";
import CapturedImage from "../components/Features/diagnosis/capturedImage";
import ReportCard from "../components/Features/diagnosis/reportCard";
import Tabs from "../components/Forms/tabs"; // Tabs 컴포넌트 임포트

// --- 기능 컴포넌트/훅 ---
import RecommendedProductSection from "./RecommendPage"; // 상품 추천 섹션 컴포넌트 (아래 생성)

// --- 유틸리티/타입 ---
import {
    severityLevels,
    conditionNames,
    conditionIcons,
    getAdvice,
    calculateSeborrheicLevel,
    DiagnosisKey,
} from "../components/Features/diagnosis/scalpSummary";
import { ScalapStatus } from "../types/DiagnosisTypes"; // ScalapStatus 타입 임포트
// --- 더미 데이터/상수 ---
const DUMMY_NICKNAME = "John doe";

const DiagnosisReport = () => {
    const location = useLocation();
    // result 객체가 state로 잘 전달되었는지 확인하고, 타입 정의가 있다면 명시하는 것이 좋습니다.
    // interface DiagnosisResult { data: ScalapStatus; image: string; /* 기타 속성 */ }
    const result = location.state as { data: ScalapStatus; image: string; /* 기타 속성 */ }

    const user = useUserStore((state) => state.myProfile);
    const movemain = useMoveMain();

    // 1. 탭 상태 관리
    const [activeTab, setActiveTab] = useState<'consulting' | 'recommendations'>('consulting'); // 기본값 'consulting'

    // PDF 저장 관련
    const [isSavingPdf, setIsSavingPdf] = useState(false); // PDF 저장 중 상태 (필요시 사용)
    const { toPDF, targetRef } = usePDF({ filename: `${user?.userNickname || DUMMY_NICKNAME}_두피진단리포트.pdf` });

    // --- 조언 카드 생성 로직 (기존 코드 유지) ---
    const generateAdviceCards = (diagnosisData :ScalapStatus) => {
        if (!diagnosisData) {
            return <p>진단 데이터를 불러올 수 없습니다.</p>;
        }
        const cards: React.ReactNode[] = [];
        const diagnosisKeys = Object.keys(diagnosisData) as DiagnosisKey[];

        // 지루성 두피염 카드
        const seborrheicLevel = calculateSeborrheicLevel(diagnosisData);
        const seborrheicAdvice = getAdvice('seborrheicDermatitis', seborrheicLevel);
        const SeborrheicIcon = conditionIcons['seborrheicDermatitis'];
        if (seborrheicAdvice) {
            cards.push(
                <ReportCard key="seborrheicDermatitis" score={seborrheicLevel} icon={<SeborrheicIcon size={24} />} title={`${conditionNames['seborrheicDermatitis']}: ${severityLevels[seborrheicLevel]} 단계`} description={seborrheicAdvice.description} onClick={() => {}} />
            );
        }

        // 탈모 카드
        const hairLossScore = diagnosisData.hairLoss ?? 0;
        const hairLossAdvice = getAdvice('hairLoss', hairLossScore);
        const HairLossIcon = conditionIcons['hairLoss'];
        if (hairLossAdvice) {
            cards.push(
                 <ReportCard key="hairLoss" score={hairLossScore} icon={<HairLossIcon size={24} />} title={`${conditionNames['hairLoss']}: ${severityLevels[hairLossScore]} 단계`} description={hairLossAdvice.description} onClick={() => {}} />
            );
        }

        // 기타 진단 항목 카드 (탈모 제외)
        diagnosisKeys.forEach((key) => {
             if (key === 'hairLoss' || key === 'seborrheicDermatitis' || !(key in conditionNames)) return; // 지루성/탈모 제외
             const score = diagnosisData[key] ?? 0;
             const advice = getAdvice(key, score);
             const IconComponent = conditionIcons[key] || conditionIcons.default;
             if (advice) {
                 cards.push(
                     <ReportCard key={key} score={score} icon={<IconComponent size={24} />} title={`${conditionNames[key]}: ${severityLevels[score]} 단계`} description={advice.description} onClick={() => {}} />
                 );
             }
        });
        return cards;
    };
    // --- 조언 카드 생성 로직 끝 ---

    // 4. 컨설팅 내용 렌더링 함수
    const renderConsultingContent = () => (
        <>
            {/* ScalpChart에 result.data 전달 확인 */}
            <ScalpChart data={result?.data} />
            <Title text={`두피 진단결과`} />
            {/* CapturedImage에 result.image 전달 확인 */}
            <CapturedImage imgUrl={result?.image} />
            <Title text={`${user?.userNickname || DUMMY_NICKNAME}님의 두피 컨설팅`} />
            <div className="space-y-4 mt-4 mb-4">
                {generateAdviceCards(result?.data)}
            </div>
        </>
    );

    // 2. 탭 아이템 정의
    const tabItems = [
        { key: 'consulting', label: '두피 컨설팅' },
        { key: 'recommendations', label: '맞춤 상품 추천' },
    ];

    // result 데이터가 없는 경우 처리 (예: 잘못된 접근)
    if (!result || !result.data) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p>진단 결과 데이터가 없습니다.</p>
                <button onClick={movemain} className="ml-4 p-2 border rounded">메인으로</button>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-y-auto w-full relative mx-auto bg-gray-50">
            <Header menu="두피 진단 리포트" />
            <Title text={`${user?.userNickname || DUMMY_NICKNAME}님의 두피 리포트`} />

            {/* 2. Tabs 컴포넌트 렌더링 */}
            <div className="px-4 mt-4"> {/* 탭 좌우 여백 */}
                 <Tabs
                    tabs={tabItems}
                    activeTab={activeTab}
                    // Tabs 컴포넌트가 onTabClick에 어떤 타입(string, TabKey 등)을 전달하는지 확인 필요
                    onTabClick={(tabKey) => setActiveTab(tabKey as 'consulting' | 'recommendations')}
                    className="" // 필요시 스타일 추가
                 />
            </div>

            {/* 6. PDF 저장 범위: 탭 아래 콘텐츠 영역 */}
            {/* 하단 버튼과 겹치지 않도록 충분한 padding-bottom */}
            <div ref={targetRef} className="px-4 pb-24 mt-4"> {/* 탭 아래 내용 시작 */}
                {/* 3. 조건부 렌더링 */}
                {activeTab === 'consulting' && renderConsultingContent()}

                {activeTab === 'recommendations' && (
                    // 5. 상품 추천 섹션 렌더링 및 result.data 전달
                    <RecommendedProductSection scalpStatusData={result.data} />
                )}
            </div>

            {/* 하단 고정 버튼 영역 (PDF 캡처 제외) */}
            <div className="sticky bottom-0 w-full flex justify-center bg-gray-50 border-t border-gray-200"> {/* 배경색 및 구분선 추가 */}
                <button
                    className={`w-1/3 py-3 px-4 font-semibold transition duration-300 ease-in-out hover:brightness-90 rounded-none text-[#504A7E] bg-gray-100 ${isSavingPdf ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => { if (!isSavingPdf) movemain(); }}
                    disabled={isSavingPdf}
                >
                    메인화면
                </button>
                <button
                    className={`w-2/3 py-3 px-4 font-semibold rounded-none transition duration-300 ease-in-out hover:brightness-90 text-white ${isSavingPdf ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5CC6B8]'}`}
                    onClick={() => {
                        if (isSavingPdf) return;
                        setIsSavingPdf(true);
                        toPDF()
                        setIsSavingPdf(false);
                    }}
                    disabled={isSavingPdf}
                >
                    {isSavingPdf ? "저장 중..." : "진단 기록 저장"}
                </button>
            </div>
        </div>
    );
}

export default DiagnosisReport;
