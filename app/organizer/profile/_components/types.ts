export interface IOrganizationData {
  organizationName: string;
  about?: string;
  website?: string;
  tagLine?: string;
  address?: string;
}

export interface IOrganizerProfileResponse {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  organization?: IOrganizationData | null;
}

export interface IOrganizerProfileFormValues {
  firstname: string;
  lastname: string;
  organizationName: string;
  tagLine: string;
  website: string;
  address: string;
  about: string;
}
