import { z } from "zod";

import { EventStatus } from "@/lib/constants/eventStatus";

export const getMyEventsSearchParamsSchema = z.object({
  searchText: z.union([z.string(), z.null()]).optional(),
  status: z.enum([EventStatus.PUBLISHED, EventStatus.CANCELLED, EventStatus.DRAFT, EventStatus.INACTIVE, 'ALL']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
});

export type GetMyEventsSearchParamsDto = z.infer<typeof getMyEventsSearchParamsSchema>;
