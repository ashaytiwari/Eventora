import { EventStatus } from "@/lib/constants/eventStatus";
import { Gender } from "@/lib/constants/gender";

export interface AttendeeMember {
  fullName: string;
  age: number | "";
  gender: Gender;
}

export interface AttendeeEvent {
  _id: string;
  title: string;
  about?: string;
  image?: string;
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
  organization?: {
    _id?: string;
    organizationName: string;
    tagLine?: string;
    website?: string;
    address?: string;
    about?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpcomingEventsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UpcomingEventsResponse {
  events: AttendeeEvent[];
  pagination: UpcomingEventsPagination;
}

export interface UpcomingEventsFilters {
  searchText: string;
  status: EventStatus | "ALL";
}

export interface EventRegistrationPayload {
  eventId: string;
  attendees: Array<{
    fullName: string;
    age: number;
    gender: Gender;
  }>;
}
