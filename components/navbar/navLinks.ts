import { Calendar, Users, LayoutDashboard, Building2, Ticket } from "lucide-react";

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
      href: "/attendee",
      icon: Calendar,
      isActive: pathname === "/attendee",
    },
    {
      name: "My Events",
      href: "/attendee/my-events",
      icon: Ticket,
      isActive: pathname === "/attendee/my-events",
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