import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import axiosInstance from "@/lib/axios";
import { EventStatus } from "@/lib/constants/eventStatus";

import { EventFilterStatus, IEventListItem, IGetAdminEventsResponse } from "./types";

interface UseAdminEventsParams {
  status: EventFilterStatus;
  searchText?: string;
  page: number;
  limit: number;
}

interface UpdateEventStatusParams {
  eventId: string;
  status: EventStatus;
}

export function useAdminEvents({
  status,
  searchText,
  page,
  limit,
}: UseAdminEventsParams) {

  return useQuery<IGetAdminEventsResponse>({
    queryKey: ["admin-events", { status, searchText, page, limit }],
    queryFn: async () => {
      const response = await axiosInstance.get("/events", {
        params: {
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

export function useUpdateEventStatus() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, status }: UpdateEventStatusParams) => {
      const response = await axiosInstance.patch(`/events/${eventId}`, { status });
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`Event status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-event-detail", variables.eventId] });
    },
    onError: (error: unknown) => {
      const errorMsg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to update event status";
      toast.error(errorMsg || "Failed to update event status");
    },
  });

}

export function useAdminEventById(id?: string | null) {

  return useQuery<IEventListItem>({
    queryKey: ["admin-event-detail", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/events/${id}`);
      return response.data?.data;
    },
    enabled: Boolean(id),
  });

}
