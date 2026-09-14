import { EventStatus } from "@/lib/constants/eventStatus";

export type EventFilterStatus = "ALL" | EventStatus;

export interface IEventListItem {
  _id: string;
  title: string;
  image?: string;
  seoTags?: string[];
  startAt: string;
  endAt: string;
  isVirtualEvent?: boolean;
  eventLocation?: string;
  organizerId: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IPaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IGetOrganizerEventsResponse {
  events: IEventListItem[];
  pagination: IPaginationData;
}
