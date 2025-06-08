import { useNavigate } from "react-router-dom";


export const useMoveMain = () => {
    const navigate = useNavigate();
    const goMain = () => {
        navigate('/');
    }
    return goMain;

};
