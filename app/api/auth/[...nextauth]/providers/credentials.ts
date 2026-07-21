import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { authService } from "@/services/auth.service";
import { connectDB } from "@/lib/utils";

export const credentialsProvider = Credentials({
  name: "Credentials",

  credentials: {
    email: {
      label: "Email",
      type: "email",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },

  async authorize(credentials) {

    await connectDB();

    // Validate incoming credentials
    const parsed = z
      .object({
        email: z.email(),
        password: z.string().min(1),
      })
      .safeParse(credentials);

    if (!parsed.success) {
      return null;
    }

    const { email, password } = parsed.data;

    const user = await authService.login(email, password);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    };
  },
});