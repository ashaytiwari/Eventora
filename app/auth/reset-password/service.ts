import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

import { IResetPasswordParams } from "./interface";

export function useAuthResetPassword() {

  return useMutation({
    mutationFn: async (params: IResetPasswordParams) => {
      const response = await axiosInstance.post('/auth/reset-password', params);
      return response;
    },
    onSuccess: (response) => {
      console.log(response);
    }
  });

}