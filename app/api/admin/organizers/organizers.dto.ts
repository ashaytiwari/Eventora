import { z } from 'zod';

import { messages, UserStatus } from '@/lib/constants';

export const addOrganizersSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(2, {
      message: messages.register.firstNameMustBeAtleast2CharLong,
    }),
  lastname: z
    .string()
    .trim()
    .min(2, {
      message: messages.register.lastNameMustBeAtleast2CharLong,
    }),
  email: z.email({
    message: messages.register.invalidEmailAddress,
  }),
  organizationName: z.string().trim().min(2, {
    message: messages.register.organizationNameMustBeAtleast2CharLong
  }),
});

export type AddOrganizersDto = z.infer<typeof addOrganizersSchema>;