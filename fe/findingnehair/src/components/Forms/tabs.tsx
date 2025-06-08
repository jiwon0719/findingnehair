// 1. 제네릭 타입 파라미터 <T extends string> 추가
interface TabsProps<T extends string> {
  activeTab: T; // activeTab 타입을 T로 변경
  onTabClick: (tab: T) => void; // onTabClick 콜백의 파라미터 타입을 T로 변경
  tabs: { key: T; label: string }[]; // tabs 배열의 key 타입을 T로 변경
  className?: string;
}

// 2. 컴포넌트 정의에 제네릭 타입 파라미터 적용
const Tabs = <T extends string>({ activeTab, onTabClick, tabs, className = '' }: TabsProps<T>) => {
  return (
    <div className={`flex justify-center space-x-4 mt-2 mb-4 ${className}`}>
      {tabs.map((tab) => (
        <div
          key={tab.key} // tab.key는 이제 T 타입입니다.
          className={`cursor-pointer text-md px-4 py-2 ${
            activeTab === tab.key
              ? 'border-b-4 border-[#5CC6B8] text-[#5CC6B8] font-bold'
              : 'text-gray-700 hover:text-[#5CC6B8]'
          }`}
          // onClick 핸들러에서 전달되는 tab.key도 T 타입이므로 호환됩니다.
          onClick={() => onTabClick(tab.key)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default Tabs;