import { z } from "zod";

import { messages, UserStatus } from "@/lib/constants";

export const updateOrganizerSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(2, {
      message: messages.register.firstNameMustBeAtleast2CharLong,
    })
    .optional(),
  lastname: z
    .string()
    .trim()
    .min(2, {
      message: messages.register.lastNameMustBeAtleast2CharLong,
    })
    .optional(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.SUSPENDED]).optional(),
  organizationName: z
    .string()
    .trim()
    .min(2, {
      message: messages.register.organizationNameMustBeAtleast2CharLong,
    })
    .optional(),
  about: z.string().trim().optional(),
  website: z.string().trim().optional(),
  tagLine: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export type UpdateOrganizerDto = z.infer<typeof updateOrganizerSchema>;