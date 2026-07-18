import { z } from 'zod';

import { messages } from '@/lib/constants';

export const registerSchema = z.object({
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
  password: z
    .string()
    .min(8, {
      message: messages.register.passwordMustBeMin8CharLong,
    })
    .max(100, {
      message: messages.register.passwordMustNotExceed100Chars,
    }),
});

export type RegisterDto = z.infer<typeof registerSchema>;