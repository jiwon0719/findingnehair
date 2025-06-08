import React, { ReactNode } from 'react';

interface ReportCardProps {
  icon: ReactNode;    // 아이콘 컴포넌트
  title: string;      // 카드 제목 (예: "피지 과다: 주의 단계")
  onClick: () => void;// 카드 클릭 시 실행될 함수
  description?: string;// 상세 조언 내용
  score: number;      // 진단 점수 (0, 1, 2, 3) - 이 값을 기준으로 색상 변경
}

const ReportCard: React.FC<ReportCardProps> = ({ icon, title, onClick, description, score }) => {

  // 점수(score)에 따라 Tailwind CSS 색상 클래스를 반환하는 함수
  const getIconColorClass = (currentScore: number): string => {
    switch (currentScore) {
      case 0: // 건강
        return 'text-blue-500';   // 파란색 계열 (예: 건강)
      case 1: // 유의
        return 'text-yellow-500'; // 노란색 계열 (예: 유의)
      case 2: // 주의
        return 'text-orange-500'; // 주황색 계열 (예: 주의)
      case 3: // 심각
        return 'text-red-600';    // 빨간색 계열 (예: 심각)
      default: // 그 외 (값이 없거나 예상 범위 밖)
        return 'text-gray-500';   // 기본 회색
    }
  };

  // 현재 점수에 맞는 색상 클래스 가져오기
  const iconColorClass = getIconColorClass(score);

  return (
    <div
      className="w-full bg-white rounded-lg shadow-md flex items-start p-4 transition-shadow duration-200 ease-in-out mb-3"
      onClick={onClick}
    >
      {/* 아이콘 영역 */}
      <div className="mr-3 pt-1 flex-shrink-0">
        {/* 아이콘 색상 클래스를 동적으로 적용 */}
        <span className={`text-3xl ${iconColorClass}`}>{icon}</span>
        {/* ↑↑↑ 여기에 동적 클래스 적용 */}
      </div>

      {/* 텍스트 내용 영역 */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-bold text-gray-800 truncate mb-1">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ReportCard;