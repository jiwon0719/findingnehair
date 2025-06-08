import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import useUserStore from "../../../store/userStore";
import { baseURL } from "../../../api/axiosInstance";

const KakaoRedirectPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useUserStore((state) => state.login);

  useEffect(() => {
    const code = searchParams.get("code");
      if (code) {
        axios.get(`${baseURL}/auth/login/kakao?code=${code}`, {
        withCredentials: true,
      })
        .then((res) => {
          console.log(res);
          const authHeader = res.headers["authorization"];
          console.log("Authorization 헤더:", authHeader);

          if (authHeader?.startsWith("Bearer ")) {
            const accessToken = authHeader.substring(7);
            localStorage.setItem("accessToken", accessToken);
            login(accessToken);
            console.log("accessToken 저장 완료:", accessToken);
            navigate("/");
          } else {
            Swal.fire({
              title: "로그인 실패",
              text: "accessToken을 받을 수 없습니다.",
              icon: "warning",
              confirmButtonColor: "#5CC6B8",
              confirmButtonText: "확인",
              width: "450px",
              background: "#f8f9fa",
              customClass: {
                icon: "custom-icon",
                title: "custom-title",
              }
            })
          }
        })
        .catch((err) => {
          console.error("로그인 실패", err);
          console.error("응답 전체:", err.response);
          Swal.fire({
            title: '로그인 실패',
            text: '로그인에 실패했습니다. 다시 시도해주세요.',
            icon: 'error',
            confirmButtonColor: "#5CC6B8",
            confirmButtonText: "확인",
            width: "450px",
            background: "#f8f9fa",
            customClass: {
            title: "custom-title",
            }
        });
          navigate("/");
        });
    } else {
      Swal.fire({
        title: "로그인 실패",
        text: "인가 코드가 없습니다.",
        icon: "warning",
        confirmButtonColor: "#5CC6B8",
        confirmButtonText: "확인",
        width: "450px",
        background: "#f8f9fa",
        customClass: {
          icon: "custom-icon",
          title: "custom-title",
        }
      })
      navigate("/");
    }
  }, [navigate, searchParams]);

  return null;
};

export default KakaoRedirectPage;
