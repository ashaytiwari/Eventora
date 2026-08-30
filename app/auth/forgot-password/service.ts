import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

import { IForgotPasswordParams } from "./interface";

export function useAuthForgotPassword() {

  return useMutation({
    mutationFn: async (params: IForgotPasswordParams) => {
      const response = await axiosInstance.post('/auth/forgot-password', params);
      return response;
    },
    onSuccess: (response) => {
      console.log(response);
    }
  });

}