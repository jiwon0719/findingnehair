import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import useUserStore from "../store/userStore";
import { logout } from "../api/authapi";
import { AxiosError } from "axios";

// 로그아웃 훅
export const useLogout = () => {
  const mutationOptions: UseMutationOptions<void, AxiosError, void, unknown> = {
    onSuccess: () => {
      useUserStore.getState().logout();
    },
    onError: (error) => {
      console.error(error);
    },
    mutationFn: logout,
  };
  return useMutation(mutationOptions);
}
