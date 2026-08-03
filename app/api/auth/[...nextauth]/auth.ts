import { authCallbacks } from "./callbacks";
import { credentialsProvider } from "./providers/credentials";
import { googleProvider } from "./providers/google";

export const authOptions = {
  providers: [
    credentialsProvider,
    googleProvider
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: authCallbacks,

  pages: {
    signIn: "/login",
  },
};