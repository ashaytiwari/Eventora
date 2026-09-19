import { Calendar, Users, LayoutDashboard, Building2 } from "lucide-react";

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

  const organizerNavLinks = [
    {
      name: "My Events",
      href: "/organizer",
      icon: Calendar,
      isActive: pathname === "/organizer" || pathname === "/organizer/events",
    },
    {
      name: "Profile",
      href: "/organizer/profile",
      icon: Building2,
      isActive: pathname === "/organizer/profile",
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
  } else if (role === UserRole.EVENT_ORGANIZER) {
    return organizerNavLinks;
  } else if (role === UserRole.EVENT_ATTENDEE) {
    return eventAttendeesNavLinks;
  } else {
    return [];
  }

}