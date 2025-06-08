// --- 데이터 매핑 함수들 ---

// 성별: '남성' -> 0, '여성' -> 1
export const mapGenderToInt = (gender: string | ''): number | null => {
    if (gender === '남성') return 0;
    if (gender === '여성') return 1;
    return null;
};

// 연령대: '10대' -> 10, '20대' -> 20, ...
export const mapAgeGroupToInt = (ageGroup: string): number | null => {
    switch (ageGroup) {
        case '10대': return 10;
        case '20대': return 20;
        case '30대': return 30;
        case '40대': return 40;
        case '50대': return 50;
        case '60대 이상': return 60;
        default: return null;
    }
};

// 샴푸 빈도: 1점(거의 안 씀) ~ 5점(매우 자주)
export const mapShampooFrequencyToInt = (frequency: string): number | null => {
    switch (frequency) {
        case '1일 2회': return 5;
        case '1일 1회': return 4;
        case '3일에 1회': return 3;
        case '1주일에 2회': return 2;
        case '1주일에 1회': return 1;
        default: return null;
    }
};

// 펌/염색 빈도: 1점(하지 않음) ~ 5점(4회 이상/년)
export const mapTreatmentFrequencyToInt = (frequency: string): number | null => {
  switch (frequency) {
    case '하지 않음':   return 1;
    case '1회/년':     return 2;
    case '2회/년':     return 3;
    case '3회/년':     return 4;
    case '4회 이상/년': return 5; // '4회 이상/년' 옵션 추가 및 5점 매핑
    default: return null;
  }
};
