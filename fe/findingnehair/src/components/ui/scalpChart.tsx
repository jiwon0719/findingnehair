import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { conditionNames, DiagnosisKey } from '../Features/diagnosis/scalpSummary';

/**
 * Recharts 라이브러리가 내부적으로 사용할 데이터 형식 정의
 * - subject: 차트 축에 표시될 한글 항목 이름
 * - displayMy: 차트에 표시될 +1 처리된 점수
 * - originalMy: 실제 데이터 점수 (0~3)
 */
interface InternalChartData {
    subject: string;
    displayMy: number;
    originalMy: number;
}

/**
 * ScalpChart 컴포넌트가 받을 Props 타입 정의
 * - data: 진단 결과를 담고 있는 객체 ({ 항목Key: 점수, ... })
 */
interface ScalpChartProps {
    // data prop의 타입을 진단 결과 객체 형태로 변경
    data: { [key in DiagnosisKey]?: number } | null | undefined;
}

const ScalpChart = ({ data }: ScalpChartProps) => {
    // 1. 입력 데이터 유효성 검사
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        return (
            <ResponsiveContainer width="90%" height={375}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    차트 데이터를 표시할 수 없습니다.
                </div>
            </ResponsiveContainer>
        );
    }

    // 2. 데이터 변환: 객체 -> Recharts용 배열 ({ subject: '한글명', displayMy: 점수 + 1, originalMy: 점수 }[])
    const transformedData: InternalChartData[] = Object.keys(data)
        .filter((key): key is DiagnosisKey => Object.prototype.hasOwnProperty.call(conditionNames, key) && key !== 'seborrheicDermatitis')
        // conditionNames에 정의되어 있고, 'seborrheicDermatitis'가 아닌 항목만 필터링, 타입 가드 적용
        // .filter(key => conditionNames[key] && key !== 'seborrheicDermatitis')
        // Recharts가 요구하는 형태로 매핑
        .map(key => ({
            subject: conditionNames[key],             // conditionNames에서 한글 이름 가져오기
            displayMy: (data[key] ?? 0) + 1,         // 해당 키의 점수에 +1 하여 표시
            originalMy: data[key] ?? 0,              // 실제 데이터 값 저장
        }));

    // 3. 변환 후 데이터 유효성 검사
    if (transformedData.length === 0) {
        return (
            <ResponsiveContainer width="90%" height={375}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    차트에 표시할 유효한 진단 항목이 없습니다.
                </div>
            </ResponsiveContainer>
        );
    }

    // 4. 차트 렌더링 (변환된 transformedData 사용)
    return (
        <ResponsiveContainer width="100%" height={375}>
            <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={transformedData} // 변환된 배열 데이터를 사용
            >
                <PolarGrid />
                {/* PolarRadiusAxis의 domain 값을 [1, 4]로 변경 */}
                <PolarRadiusAxis domain={[0, 4]} tick={false} axisLine={false} />
                <PolarAngleAxis
                    dataKey="subject" // transformedData의 'subject' 키 (한글 이름)를 레이블로 사용
                    tick={{ fontSize: 12, fill: '#333' }}
                />
                <Radar
                    name="진단결과"
                    dataKey="displayMy" // transformedData의 'displayMy' 키 (점수 + 1)를 데이터로 사용
                    stroke="#5CC6B8"
                    fill="#5CC6B8"
                    fillOpacity={0.6}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}

export default ScalpChart;