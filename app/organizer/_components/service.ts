import { useQuery } from "@tanstack/react-query";

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
