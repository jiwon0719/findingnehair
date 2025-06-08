import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProfile } from '../api/authapi';
import Swal from 'sweetalert2';

interface UserState {
  isLoggedIn: boolean;
  user: { userNickname: string; userId: number; userImgUrl: string; } | null;
  logout: () => void;
  authToken: string | null;
  login: (token: string) => Promise<void>; // login 비동기 함수로 변경
  myProfile: { userNickname: string; userId: number; userImgUrl: string; } | null;
  getMyProfile: (token: string | null) => Promise<void>;
  isLoading: boolean;
  showScalp: boolean;
  setShowScalp: (show: boolean) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      authToken: null,
      myProfile: null,
      isLoading: false,
      showScalp: false,
      setShowScalp: (show: boolean) => set({ showScalp: show }),

      logout: () => {
        localStorage.removeItem('accessToken');
        set({ isLoggedIn: false, user: null, authToken: null, myProfile: null });
        Swal.fire({
            title:'로그아웃',
            text:"성공적으로 로그아웃되었습니다.",
            icon:"success",
            confirmButtonColor: "#5CC6B8",
            confirmButtonText: "확인",
            width: "450px",
            background: "#f8f9fa",
            customClass: {
              title: "custom-title",
            }
        }).then(()=>{
            window.location.reload();
        })
      },

      login: async (token: string) => {
        localStorage.setItem('accessToken', token);
        set({ isLoggedIn: true, authToken: token });
        await get().getMyProfile(token);
      },

      getMyProfile: async (token: string | null) => {
        if (!token) {
          console.error('토큰이 없습니다.');
          return;
        }

        set({ isLoading: true }); // 로딩 시작

        try {
          const response = await getProfile();
          set({ myProfile: response, isLoading: false });
          console.log('Zustand 스토어 업데이트: 프로필 정보 저장 완료');
        } catch (error) {
          console.error('프로필 정보를 불러오는 중 오류 발생:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'user-storage', // 저장소의 이름을 지정합니다.
    }
  )
);

export default useUserStore;