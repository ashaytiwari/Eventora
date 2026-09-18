import { Calendar, Users, LayoutDashboard } from "lucide-react";

import { UserRole } from "@/lib/constants";

export function getUserNavbarLinks(pathname: string, role: string) {

  const adminNavLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: Calendar,
      isActive: pathname === "/admin/events",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      isActive: pathname === "/admin/users",
    },
  ];

  const eventAttendeesNavLinks = [
    {
      name: "Events",
      href: "/admin/events",
      icon: Calendar,
      isActive: pathname === "/admin/events" || pathname === "/admin",
    },
  ];

  if (role === UserRole.SUPER_ADMIN) {
    return adminNavLinks;
  } else if (role === UserRole.EVENT_ATTENDEE) {
    return eventAttendeesNavLinks;
  } else {
    return [];
  }

}