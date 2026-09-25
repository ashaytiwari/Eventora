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
  virtualEventLink?: string;
  eventLocation?: string;
  organizerId: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IEventDetail extends IEventListItem {
  about: string;
  language: string;
  ageLimit?: number;
  artist?: {
    name: string;
    image?: string;
  };
  organization?: {
    _id?: string;
    organizationName: string;
    tagLine?: string;
    website?: string;
    address?: string;
    about?: string;
  };
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

export interface IEventRegistrationUser {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface IAttendeeMember {
  fullName: string;
  age: number;
  gender: string;
}

export interface IEventRegistrationItem {
  _id: string;
  eventId: string;
  registeredAt: string;
  user: IEventRegistrationUser;
  attendeeDetails: IAttendeeMember[];
  totalAttendees: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGetEventRegistrationsResponse {
  registrations: IEventRegistrationItem[];
  summary: {
    totalRegistrations: number;
    totalAttendees: number;
  };
  pagination: IPaginationData;
}
