import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

import { EventFilterStatus, IGetOrganizerEventsResponse } from "./types";

interface UseOrganizerEventsParams {
  status: EventFilterStatus;
  searchText?: string;
  page: number;
  limit: number;
}

export function useOrganizerEvents({
  status,
  searchText,
  page,
  limit,
}: UseOrganizerEventsParams) {

  return useQuery<IGetOrganizerEventsResponse>({
    queryKey: ["organizer-events", { status, searchText, page, limit }],
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

export function useCreateEvent() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: any) => {
      const response = await axiosInstance.post("/events", eventData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
    },
  });

}

export function useEventById(id?: string | null) {

  return useQuery({
    queryKey: ["event-detail", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/events/${id}`);
      return response.data?.data;
    },
    enabled: Boolean(id),
  });

}

export function useUpdateEvent(id?: string | null) {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: any) => {
      const response = await axiosInstance.put(`/events/${id}`, eventData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      queryClient.invalidateQueries({ queryKey: ["event-detail", id] });
    },
  });

}
