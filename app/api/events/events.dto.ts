import { z } from 'zod';

import { messages } from '@/lib/constants';
import { EventStatus } from '@/lib/constants/eventStatus';

export const addEventSchema = z.object({
  title: z.string().trim().min(2, {
    message: messages.createEvent.titleMustBeAtleast2CharLong
  }),
  about: z.string().trim().min(20, {
    message: messages.createEvent.aboutMustBeAtleast20CharLong
  }),
  image: z.url(),
  artist: z.object({
    name: z.string(),
    image: z.url()
  }).optional(),
  seoTags: z.array(z.string()),
  startAt: z.string(),
  endAt: z.string(),
  ageLimit: z.number().optional(),
  language: z.string(),
  isVirtualEvent: z.boolean().optional(),
  virtualEventLink: z.url().optional(),
  eventLocation: z.string().optional(),
  status: z.enum(EventStatus),
});

export type AddEventDto = z.infer<typeof addEventSchema>;

export const getEventsSearchParamsSchema = z.object({
  status: z.enum([EventStatus.DRAFT, EventStatus.PUBLISHED, EventStatus.CANCELLED, EventStatus.INACTIVE, 'ALL']),
  searchText: z.union([z.string(), z.null()]).optional(),
  page: z.coerce.number(),
  limit: z.coerce.number(),
});

export type GetEventsSearchParamsDto = z.infer<typeof getEventsSearchParamsSchema>;