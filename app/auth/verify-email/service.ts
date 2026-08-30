import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

import { IVerifyEmailParams } from "./interface";

export function useAuthVerifyEmail() {

  return useMutation({
    mutationFn: async (params: IVerifyEmailParams) => {
      const response = await axiosInstance.post('/auth/verify-email', params);
      return response;
    },
    onSuccess: (response) => {
      console.log(response);
    }
  });

}