import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

export function useUserProfile(id?: string | null) {

  return useQuery<any>({
    queryKey: ["user-profile", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data?.data;
    },
    enabled: Boolean(id),
  });

}