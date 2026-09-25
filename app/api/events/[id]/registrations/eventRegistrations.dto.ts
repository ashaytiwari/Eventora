import { z } from "zod";

export const getEventRegistrationsSearchParamsSchema = z.object({
  searchText: z.union([z.string(), z.null()]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
});

export type GetEventRegistrationsSearchParamsDto = z.infer<
  typeof getEventRegistrationsSearchParamsSchema
>;
