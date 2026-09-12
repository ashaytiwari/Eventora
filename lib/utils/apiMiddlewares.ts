import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

import { errorCodes, httpStatusCodes, UserRole } from "../constants";
import { APIError } from "./apiError";

export async function requireAuth() {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new APIError(errorCodes.UNAUTHORIZED, httpStatusCodes.UNAUTHORIZED);
  }

  return session;

}

export async function requireRole(roles: UserRole[]) {

  const session = await requireAuth();

  if (!roles.includes(session.user.role)) {
    throw new APIError(errorCodes.FORBIDDEN, httpStatusCodes.FORBIDDEN);
  }

  return session;

}