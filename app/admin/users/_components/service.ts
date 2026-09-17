import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import axiosInstance from "@/lib/axios";
import { UserStatus } from "@/lib/constants";

import {
  IAddOrganizerFormValues,
  IEditOrganizerFormValues,
  IGetUsersResponse,
  UserFilterRole,
  UserFilterStatus,
} from "./types";

interface UseAdminUsersParams {
  role: UserFilterRole;
  status: UserFilterStatus;
  searchText?: string;
  page: number;
  limit: number;
}

interface UpdateUserStatusParams {
  userId: string;
  status: UserStatus;
}

interface UpdateOrganizerParams {
  userId: string;
  data: IEditOrganizerFormValues;
}

export function useAdminUsers({
  role,
  status,
  searchText,
  page,
  limit,
}: UseAdminUsersParams) {

  return useQuery<IGetUsersResponse>({
    queryKey: ["admin-users", { role, status, searchText, page, limit }],
    queryFn: async () => {
      const response = await axiosInstance.get("/users", {
        params: {
          role,
          status,
          searchText: searchText?.trim() ? searchText.trim() : undefined,
          page,
          limit,
        },
      });

      return response.data?.data;
    },
  });

}

export function useAddOrganizer() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IAddOrganizerFormValues) => {
      const response = await axiosInstance.post("/admin/organizers", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Event organizer onboarded successfully! Welcome email sent.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: unknown) => {
      const errorMsg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to onboard organizer";
      toast.error(errorMsg || "Failed to onboard organizer");
    },
  });

}

export function useUpdateOrganizer() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: UpdateOrganizerParams) => {
      const response = await axiosInstance.put(`/admin/organizers/${userId}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Organizer details updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: unknown) => {
      const errorMsg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to update organizer details";
      toast.error(errorMsg || "Failed to update organizer details");
    },
  });

}

export function useUpdateUserStatus() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: UpdateUserStatusParams) => {
      const response = await axiosInstance.patch(`/users/${userId}`, { status });
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`User status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: unknown) => {
      const errorMsg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to update user status";
      toast.error(errorMsg || "Failed to update user status");
    },
  });

}
