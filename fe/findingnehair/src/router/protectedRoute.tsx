import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
// import { getPollResult } from "../api/pollapi";
// import { getScalpHistory } from "../api/mypageapi";
import Swal from "sweetalert2";
// import { ScalpHistoryResponse } from "../types/DiagnosisTypes";
const ProtectedRoute = () => {
    const navigate = useNavigate();
    // const location = useLocation();
    const accessToken = localStorage.getItem("accessToken");
    // const [pollResult, setPollResult] = useState<any | null>(null); // Assuming pollResult can be any object or null
    // const [scalpHistory, setScalpHistory] = useState<ScalpHistoryResponse>();
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken) {
            Swal.fire({
                title: "로그인이 필요합니다!",
                text: "로그인 페이지로 이동합니다.",
                icon: "warning",
                confirmButtonColor: "#5CC6B8",
                confirmButtonText: "확인",
                width: "450px",
                background: "#f8f9fa",
                customClass: {
                    icon: "custom-icon",
                    title: "custom-title",
                }
            }).then(() => {
                navigate("/login");
            });
        }})

    //     if (location.pathname === "/recommend") {
    //         const fetchData = async () => {
    //             setLoading(true);
    //             try {
    //                 const pollData = await getPollResult();
    //                 const historyData = await getScalpHistory(0, 1);
    //                 setPollResult(pollData);
    //                 setScalpHistory(historyData);
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             } catch (error: any) {
    //                 console.error("데이터 가져오기 오류:", error);
    //                 if (error.response && error.response.status === 500) {
    //                     setPollResult({ empty: true });
    //                 } else {
    //                     console.error("데이터를 불러오는 중 오류가 발생했습니다.", error);
    //                 }
    //                 setScalpHistory({ numberOfElements: 0, content: [] });
    //             } finally {
    //                 setLoading(false);
    //             }
    //         };
    //         fetchData();
    //     } else {
    //         setLoading(false);
    //     }
    // }, [accessToken, navigate, location.pathname]);

    // useEffect(() => {
    //     if (!loading && location.pathname === "/recommend") {
    //         const isPollEmpty = pollResult?.empty === true;
    //         const isScalpHistoryEmpty = scalpHistory?.numberOfElements === 0 || scalpHistory?.content?.length === 0;

    //         if (isPollEmpty && isScalpHistoryEmpty) {
    //             Swal.fire({
    //                 title: "맞춤형 상품 추천 안내",
    //                 text: "두피 진단, 헤어 정보 입력 후 니모를 찾아서의 맞춤형 상품 추천을 받아보세요!",
    //                 icon: "info",
    //                 showCancelButton: true,
    //                 confirmButtonColor: "#5CC6B8",
    //                 cancelButtonColor: "#6c757d",
    //                 confirmButtonText: "두피 진단",
    //                 cancelButtonText: "헤어 정보 입력",
    //                 width: "450px",
    //                 background: "#f8f9fa",
    //                 customClass: {
    //                     icon: "custom-icon",
    //                     title: "custom-title",
    //                 }
    //             }).then((result) => {
    //                 if (result.isConfirmed) {
    //                     navigate("/diagnosis");
    //                 } else if (result.dismiss === Swal.DismissReason.cancel) {
    //                     navigate("/poll");
    //                 }
    //             });
    //         } else if (isPollEmpty) {
    //             Swal.fire({
    //                 title: "헤어 정보 입력 안내",
    //                 text: "니모를 찾아서의 맞춤형 상품 추천을 위해 헤어 정보를 입력해주세요!",
    //                 icon: "info",
    //                 confirmButtonColor: "#5CC6B8",
    //                 confirmButtonText: "헤어 정보 입력",
    //                 width: "450px",
    //                 background: "#f8f9fa",
    //                 customClass: {
    //                     icon: "custom-icon",
    //                     title: "custom-title",
    //                 }
    //             }).then(() => {
    //                 navigate("/poll");
    //             });
    //         } else if (isScalpHistoryEmpty) {
    //             Swal.fire({
    //                 title: "두피 진단 안내",
    //                 text: "니모를 찾아서의 맞춤형 상품 추천을 위해 두피 진단을 받아보세요!",
    //                 icon: "info",
    //                 confirmButtonColor: "#5CC6B8",
    //                 confirmButtonText: "두피 진단",
    //                 width: "450px",
    //                 background: "#f8f9fa",
    //                 customClass: {
    //                     icon: "custom-icon",
    //                     title: "custom-title",
    //                 }
    //             }).then(() => {
    //                 navigate("/diagnosis");
    //             });
    //         }
    //     }
    // }, [loading, navigate, location.pathname, pollResult, scalpHistory]);
    // if (loading && location.pathname === "/recommend") {
    //     return <div>로딩 중...</div>;
    // }
    if (!accessToken) {return null;} // accessToken이 없으면 null 반환;

    return <Outlet />;
    }

export default ProtectedRoute;
