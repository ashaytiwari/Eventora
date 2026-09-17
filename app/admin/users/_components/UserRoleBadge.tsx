import { Building2, User, ShieldCheck } from "lucide-react";

import { UserRole } from "@/lib/constants";
import { cn } from "@/lib/utils/common";

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
}

const roleConfig: Record<
  UserRole,
  {
    label: string;
    icon: typeof Building2;
    containerClass: string;
  }
> = {
  [UserRole.EVENT_ORGANIZER]: {
    label: "Organizer",
    icon: Building2,
    containerClass:
      "bg-primary/10 text-primary border-primary/30 shadow-[0_0_12px_rgba(93,254,202,0.15)]",
  },
  [UserRole.EVENT_ATTENDEE]: {
    label: "Attendee",
    icon: User,
    containerClass:
      "bg-blue/10 text-blue border-blue/30 shadow-[0_0_12px_rgba(148,234,255,0.15)]",
  },
  [UserRole.SUPER_ADMIN]: {
    label: "Super Admin",
    icon: ShieldCheck,
    containerClass:
      "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
};

const UserRoleBadge = ({ role, className }: UserRoleBadgeProps) => {

  const config = roleConfig[role] || roleConfig[UserRole.EVENT_ATTENDEE];
  const Icon = config.icon;

  const containerAttributes = {
    className: cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border font-mono backdrop-blur-sm transition-colors",
      config.containerClass,
      className
    ),
  };

  const iconAttributes = {
    className: "w-3.5 h-3.5 shrink-0",
  };

  function renderIcon() {

    return (
      <Icon {...iconAttributes} />
    );

  }

  return (
    <div {...containerAttributes}>

      {renderIcon()}

      <span>{config.label}</span>

    </div>
  );

};

export default UserRoleBadge;
