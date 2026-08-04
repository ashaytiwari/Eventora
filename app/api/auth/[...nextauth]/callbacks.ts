import { userRepository } from "@/repositories/UserRepository";
import { authService } from "@/services/auth.service";

export const authCallbacks = {

  async signIn({ user, account, profile }: any) {

    if (account?.provider !== 'google') {
      return true;
    }

    await authService.googleLogin(profile);
    return true;
  },

  async jwt({ token, user, account }: any) {

    if (user && token.email) {
      const dbUser = await userRepository.findByEmail(token.email);

      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.firstname = dbUser.firstname;
        token.lastname = dbUser.lastname;
        token.status = dbUser.status;
        token.providers = dbUser.providers;
      }
    }

    return token;

  },

  async session({ session, token }: any) {

    session.user.id = token.id as string;
    session.user.role = token.role;
    session.user.firstname = token.firstname as string;
    session.user.lastname = token.lastname as string;

    return session;
  }

};