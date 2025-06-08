import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useBack = () => {
    const navigate = useNavigate();
    //usecallback을 사용하는 이유 : 함수가 계속해서 재생성되는 것을 방지하기 위해
    const goBack = useCallback(() => {
      navigate(-1);
    }, [navigate]);

    return goBack;
}
