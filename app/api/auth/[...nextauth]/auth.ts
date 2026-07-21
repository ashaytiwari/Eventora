import { authCallbacks } from "./callbacks";
import { credentialsProvider } from "./providers/credentials";

export const authOptions = {
  providers: [
    credentialsProvider
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: authCallbacks,

  pages: {
    signIn: "/login",
  },
};