// RecentDiagnosisPage.tsx
import { useState, useEffect } from 'react';
import RecentDiagnosisList from '../components/Features/dashboard/RecentDiagnosisList';
import CommonButton from '../components/ui/CommonButton';
import Tabs from '../components/Forms/tabs'; // Tabs 컴포넌트 import
import Dashboard from '../components/Features/dashboard/Dashboard';
import { useMoveMain } from '../hooks/useMoveMain';
import { UseGetScalpHistory } from '../hooks/useMypage';
import Pagination from '../components/ui/Pagenation';
import { ApiDiagnosisItem } from '../types/DiagnosisTypes';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../components/ui/LoadingAnimation';
import useUserStore from '../store/userStore'; // 사용자 정보 훅
// No Switch import needed

const RecentDiagnosisPage = () => {
  const movemain = useMoveMain();
  const [activeTab, setActiveTab] = useState('recentDiagnosis');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const showScalp = useUserStore((state) => state.showScalp); // showScalp 상태
  const setShowScalp = useUserStore((state) => state.setShowScalp); // showScalp 상태 업데이트 함수
  const navigate = useNavigate();

  const {
    data: diagnosisHistoryData,
    isLoading: loading,
    error: fetchError,
  } = UseGetScalpHistory(currentPage - 1, itemsPerPage);

  useEffect(() => {
    if (fetchError) {
      console.error('두피 진단 기록을 불러오는 데 실패했습니다:', fetchError);
    }
  }, [fetchError]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const tabs = [
    { key: 'recentDiagnosis', label: '최근 진단' },
    { key: 'dashboard', label: '대시보드' },
  ];

  const recentDiagnosisItems: ApiDiagnosisItem[] = diagnosisHistoryData?.content || [];

  return (
    <div className="flex flex-col w-full max-w-md mx-auto justify-center p-4 pb-24">
      {/* --- Header Section --- */}
      {/* Back Button, Title, and Toggle Button are modified as requested */}
      <div className="flex items-center justify-between p-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="ml-1 text-4xl cursor-pointer flex-shrink-0"
          aria-label="뒤로 가기"
        >
          ‹
        </button>
        <h1 className="text-lg font-bold text-center flex-grow mx-2 truncate">내 최근 진단</h1>
        {/* Scalp Visibility Toggle Button - Styled */}

      </div>
      {/* --- End Header Section --- */}

      {/* Tabs 컴포넌트 사용 */}
      <Tabs activeTab={activeTab} onTabClick={setActiveTab} tabs={tabs} />

      {/* Tab Content */}
      <div className="w-full max-w-md mx-auto mt-4">
        {activeTab === 'recentDiagnosis' && (
           <div>
             {loading ? (
               <LoadingAnimation text="진단 기록을 가져오는 중.." loading={true} />
             ) : (
               <>
                 <button
                            onClick={() => setShowScalp(!showScalp)}
                            className={`text-sm px-3 py-1 rounded-full border ml-auto ${
                              showScalp
                                    ? 'bg-[#5CC6B8] text-white border-transparent'
                                    : 'bg-white text-gray-600 border-gray-300'
                            } hover:brightness-95 transition`}
                        >
               {showScalp ? '두피 숨김' : '두피 보기'}                       
               </button>


                 <RecentDiagnosisList diagnosis={recentDiagnosisItems} />
                 {diagnosisHistoryData && diagnosisHistoryData.totalPages > 1 && (
                   <Pagination
                     currentPage={diagnosisHistoryData.number + 1}
                     totalPages={diagnosisHistoryData.totalPages}
                     onPageChange={handlePageChange}
                   />
                 )}
               </>
             )}
           </div>
         )}
         {activeTab === 'dashboard' && (
           loading ? (
             <LoadingAnimation text="대시보드 데이터를 가져오는 중.." loading={true}/>
           ) : (
             <Dashboard />
           )
         )}
      </div>
      {/* End Tab Content */}

      {/* Fixed Bottom Button - Container styling reverted to original */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-md max-w-md px-0.5"> {/* <<< REVERTED HERE */}
        <CommonButton
          text="돌아가기"
          size="max"
          onClick={() => {
            movemain();
          }}
        />
      </div>
    </div>
  );
};

export default RecentDiagnosisPage;