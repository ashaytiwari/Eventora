import { UserRole } from "../constants";

export function getNavigationRedirectPath(user: any) {

  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      return "/admin";

    case UserRole.EVENT_ORGANIZER:
      return "/organizer";

    case UserRole.EVENT_ATTENDEE:
      return "/attendee";

    default:
      return "/";
  }
}