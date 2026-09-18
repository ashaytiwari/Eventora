import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

import { IAdminMetrics } from "./types";

export function useAdminMetrics() {

  return useQuery<IAdminMetrics>({
    queryKey: ["admin-metrics"],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/metrics");
      return response.data?.data;
    },
    refetchOnWindowFocus: true,
  });

}
