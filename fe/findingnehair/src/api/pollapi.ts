import axiosInstance from "./axiosInstance";


// 설문조사 전송
export const postPoll = async (data: object | number) => {
    const response = await axiosInstance.post("/user/create", data);
    return response.data;
};

// 결과 받아오기
export const getPollResult = async () => {
        const response = await axiosInstance.get(`/user/detail`);
        return response;

};

// 수정
export const putPoll = async (pollId: number, data: object) => {
    const response = await axiosInstance.put(`/user/update`, data);
    return response.data;
};