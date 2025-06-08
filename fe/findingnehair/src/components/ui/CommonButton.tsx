import React from 'react';

interface CommonButtonProps {
    text: string;
    onClick?: () => void;
    bgColor?: string;
    textColor?: string;
    size?: 'small' | 'medium' | 'large' | 'max';
}

const CommonButton: React.FC<CommonButtonProps> = ({
    text,
    onClick,
    bgColor = 'bg-[#504A7E]',
    textColor = 'text-white',
    size = 'max',
}) => {
    let widthClass = '';  // widthClass 초기화
    let sizeClass = 'py-4 px-10'; // 기본 사이즈 클래스

    if (size === 'small') {
        widthClass = 'w-1/4';  // small, medium, large는 DiagnosisCheckPage에서 사용되지 않으므로 필요 없음.
        sizeClass = 'py-2 px-4 text-sm';
    } else if (size === 'medium') {
        widthClass = 'w-1/2';
        sizeClass = 'py-3 px-6 text-base';
    } else if (size === 'large') {
        widthClass = 'w-3/4';
        sizeClass = 'py-4 px-8 text-lg';
    } else if (size === 'max') { // 'max'일 때 widthClass를 설정
        widthClass = 'w-full'; // 버튼이 부모 컨테이너의 전체 너비를 차지하도록 설정
    }

    if (bgColor === 'main') {
        bgColor = 'bg-[#5CC6B8]';
    } else if (bgColor === 'sub') {
        bgColor = 'bg-[#504A7E]';
    }

    return (
        <button
            className={`rounded-xs cursor-pointer ${bgColor} ${textColor} font-semibold transition duration-300 ease-in-out hover:brightness-75 hover:bg-opacity-80 ${widthClass} ${sizeClass}`} // widthClass 적용
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default CommonButton;