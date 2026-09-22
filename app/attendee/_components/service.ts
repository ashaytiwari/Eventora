import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import axiosInstance from "@/lib/axios";
import { EventStatus } from "@/lib/constants/eventStatus";

import {
  AttendeeEvent,
  EventRegistrationPayload,
  MyEventsResponse,
  UpcomingEventsResponse,
} from "./types";

interface UseUpcomingEventsParams {
  status?: EventStatus | "ALL";
  searchText?: string;
  limit?: number;
}

interface UseMyEventsParams {
  searchText?: string;
  status?: EventStatus | "ALL";
  page?: number;
  limit?: number;
}

export function useAttendeeUpcomingEvents({
  status,
  searchText,
  limit = 9,
}: UseUpcomingEventsParams) {

  return useInfiniteQuery<UpcomingEventsResponse>({
    queryKey: ["attendee-upcoming-events", { status, searchText, limit }],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get("/events/upcoming", {
        params: {
          status: status && status !== "ALL" ? status : undefined,
          searchText: searchText?.trim() ? searchText.trim() : undefined,
          page: pageParam,
          limit,
        },
      });

      return response.data?.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });

}

export function useAttendeeMyEvents({
  searchText,
  status,
  page = 1,
  limit = 12,
}: UseMyEventsParams = {}) {

  return useQuery<MyEventsResponse>({
    queryKey: ["attendee-my-events", { searchText, status, page, limit }],
    queryFn: async () => {
      const response = await axiosInstance.get("/events/my-events", {
        params: {
          searchText: searchText?.trim() ? searchText.trim() : undefined,
          status: status && status !== "ALL" ? status : undefined,
          page,
          limit,
        },
      });

      return response.data?.data;
    },
  });

}

export function useAttendeeEventById(id?: string | null) {

  return useQuery<AttendeeEvent>({
    queryKey: ["attendee-event-detail", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/events/${id}`);
      return response.data?.data;
    },
    enabled: Boolean(id),
  });

}

export function useIsEventRegistered(eventId?: string | null) {

  return useQuery<{ isRegistered: boolean }>({
    queryKey: ["attendee-is-registered", eventId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/events/${eventId}/is-registered`);
      return response.data?.data;
    },
    enabled: Boolean(eventId),
  });

}

const registrationErrorMessageMap: Record<string, string> = {
  EVENT_ALREADY_REGISTERED: "You are already registered for this event.",
  EVENT_REGISTRATION_CLOSED: "Registration for this event is closed.",
  EVENT_NOT_FOUND: "Event not found.",
  BAD_REQUEST: "Unable to register for this event.",
  UNAUTHORIZED: "Please sign in to register for events.",
  FORBIDDEN: "Only attendees can register for events.",
};

export function useRegisterForEvent(onSuccessCallback?: () => void) {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EventRegistrationPayload) => {
      const response = await axiosInstance.post("/events/register", payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Successfully registered for the event!");
      queryClient.invalidateQueries({ queryKey: ["attendee-upcoming-events"] });
      queryClient.invalidateQueries({ queryKey: ["attendee-my-events"] });
      queryClient.invalidateQueries({ queryKey: ["attendee-event-detail", variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ["attendee-is-registered", variables.eventId] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: unknown) => {
      const rawErrorMsg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : (error as Error)?.message || "Failed to register for event";

      const displayMessage =
        registrationErrorMessageMap[rawErrorMsg || ""] ||
        rawErrorMsg ||
        "Failed to register for event";

      toast.error(displayMessage);
    },
  });

}
