import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

import { IChangePasswordParams } from "./interface";

export function useAuthChangePassword() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: IChangePasswordParams) => {
      const response = await axiosInstance.post('/auth/change-password', params);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    }
  });

}
