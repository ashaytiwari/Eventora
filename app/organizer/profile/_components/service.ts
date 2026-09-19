import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import axiosInstance from "@/lib/axios";

import { IOrganizerProfileFormValues, IOrganizerProfileResponse } from "./types";

export function useOrganizerProfile(userId?: string | null) {

  return useQuery<IOrganizerProfileResponse>({
    queryKey: ["organizer-profile", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/organizers/${userId}`);
      return response.data?.data;
    },
    enabled: Boolean(userId),
  });

}

export function useUpdateOrganizerProfile(userId?: string | null) {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IOrganizerProfileFormValues) => {
      const response = await axiosInstance.patch(`/organizers/${userId}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["organizer-profile", userId] });
    },
    onError: (error: unknown) => {
      const errorMsg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to update profile";
      toast.error(errorMsg || "Failed to update profile");
    },
  });

}
