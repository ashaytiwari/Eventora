import { z } from "zod";

import { EventStatus } from "@/lib/constants/eventStatus";

export const getUpcomingEventsSearchParamsSchema = z.object({
  searchText: z.union([z.string(), z.null()]).optional(),
  status: z.enum([EventStatus.PUBLISHED, EventStatus.CANCELLED, 'ALL']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
});

export type GetUpcomingEventsSearchParamsDto = z.infer<typeof getUpcomingEventsSearchParamsSchema>;
