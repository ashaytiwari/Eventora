import { authService } from "@/services/auth.service";

export const authCallbacks = {

  async signIn({ user, account, profile }: any) {

    if (account?.provider !== 'google') {
      return true;
    }

    await authService.googleLogin(profile);
    return true;
  },

  async jwt({ token, user }: any) {

    if (user) {
      token.id = user.id;
      token.role = user.role;
      token.firstname = user.firstname;
      token.lastname = user.lastname;
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