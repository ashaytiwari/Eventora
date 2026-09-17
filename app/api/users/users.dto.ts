import z from "zod";

import { UserStatus, UserRole } from "@/lib/constants";

export const getUsersSearchParamsSchema = z.object({
  role: z.enum([UserRole.EVENT_ATTENDEE, UserRole.EVENT_ORGANIZER, 'ALL']),
  status: z.enum([UserStatus.ACTIVE, UserStatus.SUSPENDED, 'ALL']),
  searchText: z.union([z.string(), z.null()]).optional(),
  page: z.coerce.number(),
  limit: z.coerce.number(),
});

export type GetUsersSearchParamsDto = z.infer<typeof getUsersSearchParamsSchema>;