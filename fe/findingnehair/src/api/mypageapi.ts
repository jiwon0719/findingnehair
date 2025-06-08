import axiosInstance from "./axiosInstance";
interface ScalpHistoryResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
    content: {
        scalpImgUrl: string;
        scalpDiagnosisDate: string;
        scalpDiagnosisResult: string;
        microKeratin: number;
        excessSebum: number;
        follicularErythema: number;
        follicularInflammationPustules: number;
        dandruff: number;
        hairLoss: number;
    }[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}



export const getScalpHistory = async (page: number,size: number ) => {
    const response = await axiosInstance.get(`/mypage/scalp-history`,{
        params: {
            page,
            size
        }})
    return response.data as ScalpHistoryResponse
}

export const gemtMyArticle = async (page: number,size: number ) => {
    const response = await axiosInstance.get(`/mypage/boards?page=${page}&size=${size}`)
    return response.data
}


export const updateMyInfo = async (newNickname:string) => {
    const response= await axiosInstance.patch(
        `/mypage/update?newNickname=${newNickname}`
    )
    return response
}


export const deleteMyAccount = async () => {
    const response= await axiosInstance.delete(
        `/mypage/delete`
    )
    return response.data
}
