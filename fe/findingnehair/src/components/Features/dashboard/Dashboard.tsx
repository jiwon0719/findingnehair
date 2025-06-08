// src/components/Features/dashboard/Dashboard.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ScalpChart from '../../ui/scalpChart';
import { UseGetScalpHistory } from '../../../hooks/useMypage'; // 경로는 실제 프로젝트 구조에 맞게 조정하세요.
import { ApiDiagnosisItem } from '../../../types/DiagnosisTypes'; // ApiResponse 타입 추가
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 필터 타입 정의
type FilterType = 'last5' | 'week' | 'month' | 'year' | 'all';
const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'last5', label: '최근 5회' },
  { value: 'week', label: '최근 1주' },
  { value: 'month', label: '최근 1개월' },
  { value: 'year', label: '최근 1년' },
  { value: 'all', label: '전체 기간' },
];

/**
 * 정렬된 진단 기록 배열에서 특정 날짜 이후의 첫 번째 항목 인덱스를 이진 탐색으로 찾습니다.
 * @param data 날짜순으로 정렬된 DiagnosisItem 배열
 * @param targetDate 기준 날짜
 * @returns 기준 날짜보다 크거나 같은 첫 번째 항목의 인덱스. 없으면 data.length 반환.
 */
const findFirstIndexAfterDate = (data: ApiDiagnosisItem[], targetDate: Date): number => {
  let low = 0;
  let high = data.length; // 검색 범위를 배열 길이로 설정하여 삽입 지점을 찾도록 함

  // 이진 탐색 시작
  while (low < high) {
    const mid = Math.floor(low + (high - low) / 2);
    const itemDate = new Date(data[mid].scalpDiagnosisDate);

    if (itemDate < targetDate) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  // 루프 종료 시 'low'는 targetDate보다 크거나 같은 첫 번째 요소의 인덱스가 됨
  // 만약 모든 요소가 targetDate보다 작으면 low는 data.length가 됨
  return low;
};


const Dashboard: React.FC = () => { // Props 제거, 컴포넌트 자체적으로 데이터 관리

  // 데이터 페칭 훅 사용 (0부터 10억개까지 -> 사실상 전체 데이터 요청)
  const {
    data: diagnosisHistoryDataResponse, // API로부터 받은 원본 데이터 (정렬된 상태라고 가정)
    isLoading: loading,           // 데이터 로딩 상태
    error: fetchError,            // 데이터 페칭 중 에러 발생 여부
  } = UseGetScalpHistory(0, 1e9);

  // 상태 변수들
  const [selectedMetrics, setSelectedMetrics] = useState<keyof ApiDiagnosisItem | null>(null); // 차트에 표시할 지표
  const [filterType, setFilterType] = useState<FilterType>('last5'); // 현재 선택된 필터 타입 (기본값 '최근 5회')

  // 선택 가능한 두피 지표 목록
  const metricsOptions: (keyof ApiDiagnosisItem)[] = [
    'dandruff',
    'excessSebum',
    'follicularErythema',
    'follicularInflammationPustules',
    'hairLoss',
    'microKeratin',
  ];

  // 필터링된 진단 기록 (useMemo로 캐싱하여 성능 최적화)
  const filteredHistory = useMemo((): ApiDiagnosisItem[] => {
    // 로딩 중이거나, 데이터가 아직 없거나, 에러가 발생했으면 빈 배열 반환
    if (loading || !diagnosisHistoryDataResponse || fetchError || !diagnosisHistoryDataResponse.content) {
      return [];
    }

    const now = new Date(); // 현재 시간
    const diagnosisHistoryData = diagnosisHistoryDataResponse.content;

    switch (filterType) {
      case 'last5':
        // 원본 데이터의 마지막 5개 항목 반환
        return diagnosisHistoryData.slice(-5);
      case 'week': {
        // 7일 전 날짜 계산 (시간은 0시 0분 0초로 설정하여 해당 날짜 전체 포함)
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        // 이진 탐색으로 시작 인덱스 찾기
        const startIndex = findFirstIndexAfterDate(diagnosisHistoryData, startDate);
        // 시작 인덱스부터 끝까지의 데이터 반환
        return diagnosisHistoryData.slice(startIndex);
      }
      case 'month': {
        // 1달 전 날짜 계산
        const startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        startDate.setHours(0, 0, 0, 0);
        const startIndex = findFirstIndexAfterDate(diagnosisHistoryData, startDate);
        return diagnosisHistoryData.slice(startIndex);
      }
      case 'year': {
        // 1년 전 날짜 계산
        const startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        startDate.setHours(0, 0, 0, 0);
        const startIndex = findFirstIndexAfterDate(diagnosisHistoryData, startDate);
        return diagnosisHistoryData.slice(startIndex);
      }
      case 'all':
      default:
        // 전체 데이터 반환
        return diagnosisHistoryData;
    }
    // diagnosisHistoryDataResponse 또는 filterType이 변경될 때만 이 계산을 다시 수행
  }, [diagnosisHistoryDataResponse, filterType, loading, fetchError]);

  // 지표 키를 한글 레이블로 변환하는 함수
  const getLabelForMetric = useCallback((metric: keyof ApiDiagnosisItem): string => {
    switch (metric) {
      case 'dandruff': return '비듬';
      case 'excessSebum': return '과다 피지';
      case 'follicularErythema': return '모낭 홍반';
      case 'follicularInflammationPustules': return '모낭 염증성 농포';
      case 'hairLoss': return '탈모';
      case 'microKeratin': return '미세 각질';
      default: return '';
    }
  }, []);

  // 필터링된 데이터의 평균값 계산 (useMemo로 캐싱)
  const averageDiagnosisData = useMemo(() => {
    // 필터링된 데이터가 없으면 null 반환
    if (filteredHistory.length === 0) {
      return null;
    }
    // 각 지표의 합계를 저장할 객체 초기화
    const sum: Record<keyof Omit<ApiDiagnosisItem, 'scalpDiagnosisDate' | 'scalpImgUrl' | 'scalpDiagnosisResult'>, number> = {
      dandruff: 0,
      excessSebum: 0,
      follicularErythema: 0,
      follicularInflammationPustules: 0,
      hairLoss: 0,
      microKeratin: 0,
    };

    // 필터링된 기록을 순회하며 각 지표의 합계 계산
    filteredHistory.forEach(item => {
      (Object.keys(sum) as Array<keyof typeof sum>).forEach(key => {
        sum[key] += item[key] !== undefined ? Number(item[key]) : 0;
      });
    });

    // 평균 계산
    const count = filteredHistory.length;
    const average: Record<keyof typeof sum, number> = { ...sum };
    (Object.keys(average) as Array<keyof typeof average>).forEach(key => {
      average[key] /= count;
    });

    return average;
    // filteredHistory가 변경될 때만 이 계산을 다시 수행
  }, [filteredHistory]);

  // 라인 차트 데이터 구성 (useMemo로 캐싱)
  const chartData = useMemo(() => ({
    // X축 레이블: 필터링된 기록의 날짜
    labels: filteredHistory.map(item => new Date(item.scalpDiagnosisDate).toLocaleDateString()),
    datasets: selectedMetrics ? [ // 선택된 지표가 있을 경우에만 데이터셋 구성
      {
        label: getLabelForMetric(selectedMetrics), // Y축 레이블
        // Y축 데이터: 필터링된 기록에서 선택된 지표의 값
        data: filteredHistory.map(item => item[selectedMetrics] !== undefined ? Number(item[selectedMetrics]) : 0),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ] : [], // 선택된 지표 없으면 빈 배열
    // filteredHistory나 selectedMetrics가 변경될 때만 이 계산을 다시 수행
  }), [filteredHistory, selectedMetrics, getLabelForMetric]);

  // 라인 차트 옵션 설정
  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      title: {
        display: !!selectedMetrics, // 선택된 지표가 있을 때만 제목 표시
        text: selectedMetrics ? `${getLabelForMetric(selectedMetrics)} 변화 추이` : '', // 차트 제목
      },
      legend: {
        display: !!selectedMetrics // 범례도 선택된 지표가 있을 때만 표시
      }
    },
    scales: {
      y: {
        beginAtZero: true, // Y축 0부터 시작
        max: 4,           // Y축 최대값 4
        ticks: {
          stepSize: 1,     // Y축 눈금 간격 1
        },
      },
    },
  }), [selectedMetrics, getLabelForMetric]);

  // 차트에 표시할 지표 변경 핸들러
  const handleMetricsChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMetrics(event.target.value as keyof ApiDiagnosisItem);
  }, []);

  // 필터 타입 변경 핸들러
  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilterType(newFilter);
  }, []);

  // 표시할 최근 두피 이미지 목록 (필터링된 결과 기준 마지막 6개, useMemo로 캐싱)
  const latestDiagnosisImages = useMemo(() => {
    // 필터링된 기록의 마지막 6개 항목 가져오기
    return filteredHistory.slice(-6);
    // filteredHistory가 변경될 때만 이 계산을 다시 수행
  }, [filteredHistory]);

  // --- 렌더링 ---

  // 로딩 중일 때 표시할 내용
  if (loading) {
    return <div className="p-4 text-center">데이터를 불러오는 중입니다...</div>;
  }

  // 에러 발생 시 표시할 내용
  if (fetchError) {
    return <div className="p-4 text-center text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  // 데이터가 아직 로드되지 않았거나 비어있을 경우 (fetchError는 아님)
  if (!diagnosisHistoryDataResponse || !diagnosisHistoryDataResponse.content) {
    return <div className="p-4 text-center">표시할 진단 기록이 없습니다.</div>;
  }


  // 데이터 로딩 완료 및 에러 없음 -> 대시보드 내용 렌더링
  return (
    <div className="p-4 space-y-6">
      {/* 필터 선택 버튼 그룹 */}
      <div className="flex flex-wrap gap-2 mb-4">
      {filterOptions.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleFilterChange(value)}
          className={`text-sm px-3 py-1 rounded-full border transition 
            ${filterType === value
              ? 'bg-[#5CC6B8] text-white border-transparent'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}
          `}
        >
          {label}
        </button>
        ))}
      </div>


      {/* 최근 진단 평균 섹션 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">최근 진단 현황 ({filterOptions.find(f => f.value === filterType)?.label})</h2>
        {averageDiagnosisData ? (
          <div className="rounded-lg shadow bg-base-200 p-6">
            <h3 className="font-semibold mb-2">진단 평균</h3>
            <ScalpChart data={averageDiagnosisData} /> {/* 평균 데이터 시각화 컴포넌트 */}
          </div>
        ) : (
          <div className="alert alert-info mt-4">
            <span>선택된 기간의 진단 기록이 없어 평균 데이터를 표시할 수 없습니다.</span>
          </div>
        )}
      </div>

      {/* 항목별 변화 추이 섹션 */}
      <div className="rounded-lg shadow bg-base-200 p-6">
        <label htmlFor="metrics" className="block text-sm font-medium text-gray-700 mb-2">
          변화 추이를 보고 싶은 두피 항목을 선택하세요:
        </label>
        <select
          id="metrics"
          className="select select-bordered w-full max-w-xs mb-4"
          onChange={handleMetricsChange}
          value={selectedMetrics || ''} // 선택된 값 없으면 빈 문자열
        >
          <option value="" disabled>-- 항목 선택 --</option>
          {metricsOptions.map((metric) => (
            <option key={metric} value={metric}>
              {getLabelForMetric(metric)}
            </option>
          ))}
        </select>

        {/* 차트 또는 안내 메시지 표시 */}
        {selectedMetrics && filteredHistory.length > 0 ? (
          <div className="mt-4">
            <Line data={chartData} options={chartOptions} /> {/* 라인 차트 */}
          </div>
        ) : (
          <p className="text-gray-500 mt-4">
            {filteredHistory.length === 0
              ? '선택된 기간의 진단 기록이 없습니다.'
              : !selectedMetrics
                ? '위에서 항목을 선택해주세요.'
                : ''}
          </p>
        )}
      </div>

      {/* 최근 두피 이미지 변화 섹션 */}
      <div className="rounded-lg shadow bg-base-200 p-6">
        <h2 className="text-xl font-semibold mb-4">두피 이미지 변화 ({filterOptions.find(f => f.value === filterType)?.label})</h2>
        {latestDiagnosisImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 필터링된 마지막 6개 이미지 표시 */}
            {latestDiagnosisImages.map((item) => (
              <div key={item.scalpImgUrl} className="relative rounded-md overflow-hidden shadow-md aspect-square">
                <img
                  src={item.scalpImgUrl}
                  alt={`두피 이미지 (${new Date(item.scalpDiagnosisDate).toLocaleDateString()})`}
                  className="w-full h-full object-cover" // aspect-square와 함께 사용
                  loading="lazy" // 이미지 지연 로딩
                />
                <div className="absolute bottom-0 left-0 bg-gray-900 bg-opacity-60 text-white text-xs p-1 w-full truncate">
                  {new Date(item.scalpDiagnosisDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">선택된 기간의 두피 이미지 기록이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;