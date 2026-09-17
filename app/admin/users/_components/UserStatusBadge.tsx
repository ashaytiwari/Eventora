import { CheckCircle2, Ban } from "lucide-react";

import { UserStatus } from "@/lib/constants";
import { cn } from "@/lib/utils/common";

interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

const statusConfig: Record<
  UserStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    containerClass: string;
    dotClass: string;
  }
> = {
  [UserStatus.ACTIVE]: {
    label: "Active",
    icon: CheckCircle2,
    containerClass:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.12)]",
    dotClass: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]",
  },
  [UserStatus.SUSPENDED]: {
    label: "Suspended",
    icon: Ban,
    containerClass:
      "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.12)]",
    dotClass: "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]",
  },
};

const UserStatusBadge = ({ status, className }: UserStatusBadgeProps) => {

  const config = statusConfig[status] || statusConfig[UserStatus.ACTIVE];
  const Icon = config.icon;

  const containerAttributes = {
    className: cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border font-mono backdrop-blur-sm transition-colors",
      config.containerClass,
      className
    ),
  };

  const dotAttributes = {
    className: cn("w-1.5 h-1.5 rounded-full shrink-0", config.dotClass),
  };

  const iconAttributes = {
    className: "w-3.5 h-3.5 shrink-0",
  };

  function renderIndicator() {

    return (
      <span {...dotAttributes} />
    );

  }

  function renderIcon() {

    return (
      <Icon {...iconAttributes} />
    );

  }

  return (
    <div {...containerAttributes}>

      {renderIndicator()}

      {renderIcon()}

      <span>{config.label}</span>

    </div>
  );

};

export default UserStatusBadge;
