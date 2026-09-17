import { UserRole, UserStatus } from "@/lib/constants";

export type UserFilterRole = "ALL" | UserRole;

export type UserFilterStatus = "ALL" | UserStatus;

export interface IOrganizationDetails {
  _id?: string;
  organizationName: string;
  about?: string;
  website?: string;
  tagLine?: string;
  address?: string;
}

export interface IUserListItem {
  _id: string;
  firstname: string;
  lastname: string;
  fullName?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  organization?: IOrganizationDetails | null;
}

export interface IPaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IGetUsersResponse {
  users: IUserListItem[];
  pagination: IPaginationData;
}

export interface IAddOrganizerFormValues {
  firstname: string;
  lastname: string;
  email: string;
  organizationName: string;
}

export interface IEditOrganizerFormValues {
  firstname: string;
  lastname: string;
  status: UserStatus;
  organizationName: string;
  about?: string;
  website?: string;
  tagLine?: string;
  address?: string;
}
