import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

import { IVieryEmailParams } from "./interface";

export function useAuthVerifyEmail() {

  return useMutation({
    mutationFn: async (params: IVieryEmailParams) => {
      const response = await axiosInstance.post('/auth/verify-email', params);
      return response;
    },
    onSuccess: (response) => {
      console.log(response);
    }
  });

}