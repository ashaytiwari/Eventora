import { EventStatus } from "@/lib/constants/eventStatus";

export type EventFilterStatus = "ALL" | EventStatus;

export interface IEventListItem {
  _id: string;
  title: string;
  image?: string;
  about?: string;
  artist?: {
    name: string;
    image?: string;
  };
  seoTags?: string[];
  startAt: string;
  endAt: string;
  ageLimit?: number;
  language?: string;
  isVirtualEvent?: boolean;
  virtualEventLink?: string;
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

export interface IGetAdminEventsResponse {
  events: IEventListItem[];
  pagination: IPaginationData;
}
