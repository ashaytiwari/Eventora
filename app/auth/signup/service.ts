import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

import { ISignupParams } from "./interface";

export function useAuthSignup() {

  return useMutation({
    mutationFn: async (params: ISignupParams) => {
      const response = await axiosInstance.post('/auth/register', params);
      return response;
    },
    onSuccess: (response) => {
      console.log(response);
    }
  });

}