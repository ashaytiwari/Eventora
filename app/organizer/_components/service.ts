import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import axiosInstance from "@/lib/axios";
import { EventStatus } from "@/lib/constants/eventStatus";

import {
  EventFilterStatus,
  IEventDetail,
  IGetEventRegistrationsResponse,
  IGetOrganizerEventsResponse,
} from "./types";

interface UseOrganizerEventsParams {
  status: EventFilterStatus;
  searchText?: string;
  page: number;
  limit: number;
}

interface UseEventRegistrationsParams {
  eventId?: string | null;
  searchText?: string;
  page?: number;
  limit?: number;
}

interface UpdateEventStatusParams {
  eventId: string;
  status: EventStatus;
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

  return useQuery<IEventDetail>({
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

export function useEventRegistrations({
  eventId,
  searchText,
  page = 1,
  limit = 10,
}: UseEventRegistrationsParams) {

  return useQuery<IGetEventRegistrationsResponse>({
    queryKey: ["event-registrations", eventId, { searchText, page, limit }],
    queryFn: async () => {
      const response = await axiosInstance.get(`/events/${eventId}/registrations`, {
        params: {
          searchText: searchText?.trim() ? searchText.trim() : undefined,
          page,
          limit,
        },
      });

      return response.data?.data;
    },
    enabled: Boolean(eventId),
  });

}

export function useUpdateOrganizerEventStatus() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, status }: UpdateEventStatusParams) => {
      const response = await axiosInstance.patch(`/events/${eventId}`, { status });
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`Event status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      queryClient.invalidateQueries({ queryKey: ["event-detail", variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ["event-registrations", variables.eventId] });
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
