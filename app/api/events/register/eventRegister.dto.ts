import { Types } from "mongoose";
import z from "zod";

import { Gender } from "@/lib/constants/gender";

export const eventRegisterSchema = z.object({
  eventId: z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'Invalid event ID'
  }),

  attendees: z.array(
    z.object({
      fullName: z.string().min(2, {
        message: 'Full name must be at least 2 characters long'
      }),
      age: z.number().min(1, {
        message: 'Age must be at least 1 year old'
      }).max(120, {
        message: 'Age must be at most 120 years old'
      }),
      gender: z.enum(Object.values(Gender), {
        message: 'Invalid gender'
      })
    })
  )
});

export type EventRegisterDto = z.infer<typeof eventRegisterSchema>;