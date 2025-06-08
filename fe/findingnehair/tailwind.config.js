/** @type {import('tailwindcss').Config} */
// export default -> module.exports 로 변경
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 커스텀 색상 정의는 유지해도 괜찮지만, daisyUI 테마에서 직접 사용할 수도 있습니다.
        // primaryBg: '#F1F5F4',
        // primaryText: '#ffffff',
        // primaryHighlight: '#5CC6B8',
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  featureFlags: {
    modernColorFormat: false,
  },

  // --- daisyUI 설정 블록 추가 ---
  daisyui: {
    // 사용할 테마 목록 정의
    themes: [
      "light", // 기본 light 테마 사용
      "dark",  // 기본 dark 테마 사용
      // 여기에 커스텀 테마를 추가할 수 있습니다.
      {
        mytheme: {
          // daisyUI 시맨틱 색상 이름에 원하는 색상 코드 매핑
          "primary": "#5CC6B8",        // 기존 primaryHighlight 색상
          "primary-content": "#ffffff", // primary 색상 위의 텍스트 색상 (흰색이 적절해 보임)

          "secondary": "#f6d860",      // 보조 색상 (예시)
          "accent": "#37cdbe",         // 강조 색상 (예시)
          "neutral": "#3d4451",        // 중립 색상 (예시)

          "base-100": "#F1F5F4",       // 기본 배경색 (기존 primaryBg 색상)
          "base-content": "#374151",   // 기본 배경 위의 텍스트 색상 (예: 어두운 회색)

          // daisyUI가 사용하는 다른 시맨틱 색상들도 정의해주면 좋습니다.
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",

          // 기존 테마를 확장할 수도 있습니다:
          // ...require("daisyui/src/theming/themes")["light"], // light 테마 속성 상속
          // "primary": "#5CC6B8", // primary 색상만 오버라이드
          // "base-100": "#F1F5F4", // 배경색만 오버라이드
        },
      },
    ],
    darkTheme: "dark",      // 다크 모드 시 사용할 테마 이름 (위 themes 배열에 포함되어야 함)
    base: true,             // 루트 요소에 기본 배경/글자색 적용 여부
    styled: true,           // daisyUI 컴포넌트에 스타일 자동 적용 여부
    utils: true,            // daisyUI 유틸리티 클래스 사용 여부
    prefix: "",             // daisyUI 클래스 이름 앞에 붙일 접두사 (보통 비워둠)
    logs: true,             // 빌드 시 daisyUI 로그 출력 여부
  },
  // --- 여기까지 ---
};
