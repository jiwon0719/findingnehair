
export interface ApiDiagnosisItem {
  scalpImgUrl: string;
  scalpDiagnosisDate: string;
  scalpDiagnosisResult?: string;
  dandruff: number; // API가 숫자를 문자열로 줄 수도 있으므로 주의
  excessSebum: number;
  follicularErythema: number;
  follicularInflammationPustules: number;
  hairLoss: number;
  microKeratin: number;
}

export interface ScalapStatus {
    microKeratin: number,                      // 원본 목록에 있었으므로 기본값 0으로 추가
    excessSebum: number,                       // '지성' 항목의 mydata 값
    follicularErythema: number,                // '두피홍반' 항목의 mydata 값
    follicularInflammationPustules: number,    // '모낭홍반' 항목의 mydata 값 (매핑 추정)
    dandruff: number,                          // '비듬' 항목의 mydata 값
    hairLoss: number, 
    seborrheicDermatitis: number,               // '지루성피부염' 항목의 mydata 값 (매핑 추정)
  }
  

export interface RecentDiagnosisItemProps {
    diagnosis: {
        scalpImgUrl: string | null | undefined;
        scalpDiagnosisResult: string | null | undefined;
        scalpDiagnosisDate: string | Date; 
        microKeratin: number,                      // 원본 목록에 있었으므로 기본값 0으로 추가
        excessSebum: number,                       // '지성' 항목의 mydata 값
        follicularErythema: number,                // '두피홍반' 항목의 mydata 값
        follicularInflammationPustules: number,    // '모낭홍반' 항목의 mydata 값 (매핑 추정)
        dandruff: number,                          // '비듬' 항목의 mydata 값
        hairLoss: number, 
    };
}

interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ScalpHistoryResponse {
  content: ApiDiagnosisItem[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}