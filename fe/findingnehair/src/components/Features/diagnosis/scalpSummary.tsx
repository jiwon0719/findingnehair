import React from 'react';
import { FiDroplet, FiTriangle, FiAlertOctagon, FiWind, FiSun, FiActivity, FiAlertCircle, FiHelpCircle } from 'react-icons/fi'; // 예시 아이콘 (필요에 따라 다른 아이콘 사용 가능)
import { ScalapStatus } from '~/types/DiagnosisTypes';

// 진단 항목 키 타입 정의 (선택 사항이지만 권장)
export type DiagnosisKey =
  | 'microKeratin'
  | 'excessSebum'
  | 'follicularErythema'
  | 'follicularInflammationPustules'
  | 'dandruff'
  | 'hairLoss'
  | 'seborrheicDermatitis';

// 심각도 레벨 정의
export const severityLevels: { [key: number]: string } = {
  0: "건강",
  1: "유의",
  2: "주의",
  3: "심각",
};

// 진단 항목 한글 이름
export const conditionNames: { [key: string]: string } = {
  microKeratin: "미세 각질",
  excessSebum: "피지 과다",
  follicularErythema: "모낭사이홍반",
  follicularInflammationPustules: "모낭홍반농포",
  dandruff: "비듬",
  hairLoss: "탈모",
  seborrheicDermatitis: "지루성두피염", // 지루성 두피염 항목 추가
};

// 아이콘 매핑
export const conditionIcons: { [key: string]: React.ElementType } = {
  microKeratin: FiSun,
  excessSebum: FiDroplet,
  follicularErythema: FiTriangle, // 예시, 홍반 관련 아이콘
  follicularInflammationPustules: FiAlertOctagon, // 예시, 염증/농포 관련 아이콘
  dandruff: FiActivity, // 예시, 비듬 관련 아이콘
  hairLoss: FiWind,
  seborrheicDermatitis: FiAlertCircle, // 지루성 두피염 아이콘
  default: FiHelpCircle, // 기본 아이콘
};

// 단계별 조언 상세 내용
interface AdviceDetail {
  level: number;
  description: string;
}

// 각 항목별 조언 데이터 구조
interface ConditionAdvice {
  key: DiagnosisKey | 'seborrheicDermatitis'; // 'seborrheicDermatitis' 포함
  advice: AdviceDetail[];
}

// 모든 조언 데이터 (항목별, 단계별)
export const allAdviceData: ConditionAdvice[] = [
  {
    key: 'microKeratin',
    advice: [
      { level: 0, description: "두피 각질 상태가 깨끗하고 건강합니다. 현재 관리를 유지하세요." },
      { level: 1, description: "약간의 미세 각질이 관찰됩니다. 샴푸 시 부드럽게 마사지하고 잔여물이 남지 않도록 꼼꼼히 헹궈주세요." },
      { level: 2, description: "미세 각질이 쌓여 있습니다. 주 1-2회 두피 스케일링 제품 사용을 고려하고, 보습에 신경 써주세요." },
      { level: 3, description: "미세 각질이 두껍게 쌓여 모공을 막을 수 있습니다. 전문가와 상담하여 각질 관리 및 두피 타입에 맞는 제품 사용이 필요합니다." },
    ],
  },
  {
    key: 'excessSebum',
    advice: [
      { level: 0, description: "적절한 유수분 밸런스를 유지하고 있습니다. 현재 관리법을 유지하세요." },
      { level: 1, description: "피지 분비가 다소 증가했습니다. 순한 세정 성분의 샴푸 사용 및 피지 조절 기능성 제품 사용을 고려해보세요." },
      { level: 2, description: "피지 분비가 많아 두피가 번들거릴 수 있습니다. 딥 클렌징 샴푸를 주 1-2회 사용하고, 기름진 음식 섭취를 줄이는 것이 좋습니다." },
      { level: 3, description: "과도한 피지 분비로 염증 및 트러블 위험이 높습니다. 즉시 전문가 상담 및 피지 조절 전문 케어가 필요합니다. 샴푸 후 꼭 두피를 완전히 건조해주세요." },
    ],
  },
  {
    key: 'follicularErythema',
    advice: [
        { level: 0, description: "모낭 주변이 건강하며 붉은 기운이 없습니다." },
        { level: 1, description: "모낭 주변에 약간의 붉은 기운이 보입니다. 두피 자극을 최소화하고 진정 케어 제품 사용을 고려해보세요." },
        { level: 2, description: "모낭 주변 홍반이 뚜렷하게 관찰됩니다. 두피 열을 내리는 쿨링 제품 사용과 스트레스 관리가 필요하며, 증상 지속 시 전문가 상담을 권장합니다." },
        { level: 3, description: "모낭 주변 홍반이 심하며 염증 가능성이 있습니다. 즉시 전문가 진료를 통해 원인을 파악하고 적절한 치료를 시작해야 합니다." },
    ]
  },
  {
    key: 'follicularInflammationPustules',
    advice: [
        { level: 0, description: "모낭 염증이나 농포 없이 깨끗한 상태입니다." },
        { level: 1, description: "한두 개의 작은 뾰루지나 염증 초기 증상이 보일 수 있습니다. 두피 청결 관리에 신경 쓰고, 손으로 만지지 않도록 주의하세요." },
        { level: 2, description: "모낭 주변 염증이나 농포가 여러 개 관찰됩니다. 항균/항염 기능성 샴푸 사용 및 전문가 상담을 통해 관리가 필요합니다." },
        { level: 3, description: "모낭 염증 및 농포가 광범위하게 분포되어 심각한 상태입니다. 즉시 피부과 전문의 진료 및 치료가 필수적입니다." },
    ]
  },
   {
    key: 'dandruff',
    advice: [
      { level: 0, description: "비듬 없이 깨끗한 두피 상태를 유지하고 있습니다." },
      { level: 1, description: "건조하거나 유분으로 인한 약간의 비듬이 보입니다. 두피 타입에 맞는 샴푸 선택 및 올바른 샴푸 습관이 중요합니다." },
      { level: 2, description: "비듬이 눈에 띄게 증가했습니다. 비듬 전문 샴푸(항진균 성분 등)를 꾸준히 사용하고, 증상 개선이 없으면 전문가 상담을 받아보세요." },
      { level: 3, description: "비듬 문제가 심각하며, 두피 염증을 동반할 수 있습니다. 단순 비듬이 아닐 수 있으므로, 정확한 진단과 치료를 위해 전문가 진료가 필요합니다." },
    ],
  },
  {
    key: 'hairLoss',
    advice: [
      { level: 0, description: "모발 밀도와 굵기가 양호하여 탈모 징후는 보이지 않습니다. 건강한 생활 습관을 유지하세요." },
      { level: 1, description: "모발이 가늘어지거나 밀도가 약간 감소하는 초기 탈모 가능성이 보입니다. 스트레스 관리, 균형 잡힌 식단, 충분한 수면이 중요하며, 탈모 예방 기능성 제품 사용을 시작해보세요." },
      { level: 2, description: "탈모가 진행 중일 수 있으며, 모발 밀도 감소나 특정 부위의 탈모가 관찰될 수 있습니다. 두피 혈액순환 개선 마사지, 탈모 완화 기능성 제품 사용 및 전문가 상담을 권장합니다." },
      { level: 3, description: "탈모가 상당히 진행되어 두피가 비어 보이는 부분이 있을 수 있습니다. 즉시 피부과 전문의와 상담하여 정확한 진단과 적극적인 치료 계획(약물, 시술 등)을 세우는 것이 시급합니다." },
    ],
  },
  // 지루성 두피염 조언 (단계별 메시지는 로직 내에서 동적으로 생성)
  {
      key: 'seborrheicDermatitis',
      advice: [
          { level: 0, description: "지루성 두피염 징후는 보이지 않습니다. 청결한 두피 관리를 유지하세요." },
          { level: 1, description: "경미한 지루성 두피염 징후(피지, 각질, 약간의 붉은기 등)가 보입니다. 저자극 샴푸 사용 및 생활 습관 개선(식단, 수면)이 필요합니다." },
          { level: 2, description: "지루성 두피염(피지 과다, 홍반, 비듬 등) 증상이 나타나고 있습니다. 항진균 성분이 포함된 약용 샴푸 사용과 전문가 상담을 고려해보세요. 자극적인 헤어 제품 사용을 피하세요." },
          { level: 3, description: "지루성 두피염 증상(심한 피지, 염증, 농포, 두꺼운 비듬/각질 등)이 심각합니다. 만성 염증 상태일 수 있으므로, 즉시 피부과 전문의 진료를 통해 염증 치료 및 꾸준한 관리가 필요합니다." },
      ]
  }
];

// 특정 키와 레벨에 맞는 조언을 찾는 함수
export const getAdvice = (key: DiagnosisKey | 'seborrheicDermatitis', level: number): AdviceDetail | undefined => {
  const condition = allAdviceData.find(item => item.key === key);
  return condition?.advice.find(a => a.level === level);
};

// 지루성 두피염 관련 항목 키 목록
const seborrheicRelatedKeys: DiagnosisKey[] = [
    'excessSebum',
    'follicularErythema',
    'follicularInflammationPustules',
    'dandruff'
];

// 진단 데이터 기반 지루성 두피염 레벨 계산 함수
export const calculateSeborrheicLevel = (diagnosisData: ScalapStatus): number => {
    let maxLevel = 0;
    let sumLevel = 0;
    seborrheicRelatedKeys.forEach(key => {
        const level = diagnosisData[key] ?? 0; // 데이터가 없을 경우 0으로 처리
        if (level > maxLevel) {
            maxLevel = level;
        }
        sumLevel += level;
    });
    if (sumLevel >= 12) {
        return 3;
    } else if (sumLevel >= 8) {
        return 2;
    } else if (sumLevel >= 5) {
        return 1;
    }
    return 0;
};
