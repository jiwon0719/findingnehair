import axiosInstance from "./axiosInstance";

//주어진 사진이 두피 이미지가 아니면 false, 맞으면 true
export const checkImage = async (image: File): Promise<DiagnosisResult> => {
    const formData = new FormData();
    formData.append("image", image); // Blob을 FormData에 추가 (파일명 포함)
    const response = await axiosInstance.post("/scalp/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

//주어진 사진을 진단하고 결과를 반환
export const getDiagnosis = async (image: File): Promise<DiagnosisResult> => {
    const formData = new FormData();
    formData.append("image", image);
    const response = await axiosInstance.post("/diagnosis", formData);
    return response.data.result;
   }




   // 홍반, 비듬, 탈모, 지성, 모낭염
interface DiagnosisResult {
    scalpImgUrl: number;
    scalpDiagnosisDate: string;
    scalpDiagnosisResult: string;
    microKeratin: number;
    excessSebum: number;
    follicularErythema: number;
    follicularInflammationPustules: number;
    excessSebdandruffum: number;
    hairLoss: number;
}