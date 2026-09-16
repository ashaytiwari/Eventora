import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

import { EventStatus } from "@/lib/constants/eventStatus";
import { cn } from "@/lib/utils/common";

interface AdminEventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

const statusConfig: Record<
  EventStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    containerClass: string;
    dotClass: string;
  }
> = {
  [EventStatus.PUBLISHED]: {
    label: "Published",
    icon: CheckCircle2,
    containerClass:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.12)]",
    dotClass: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]",
  },
  [EventStatus.DRAFT]: {
    label: "Draft",
    icon: Clock,
    containerClass:
      "bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.12)]",
    dotClass: "bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.8)]",
  },
  [EventStatus.INACTIVE]: {
    label: "Inactive",
    icon: AlertCircle,
    containerClass:
      "bg-slate-500/10 text-slate-300 border-slate-500/30",
    dotClass: "bg-slate-400",
  },
  [EventStatus.CANCELLED]: {
    label: "Cancelled",
    icon: XCircle,
    containerClass:
      "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.12)]",
    dotClass: "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]",
  },
};

const AdminEventStatusBadge = ({ status, className }: AdminEventStatusBadgeProps) => {

  const config = statusConfig[status] || statusConfig[EventStatus.DRAFT];
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

  const dotAttributes = {
    className: cn("w-1.5 h-1.5 rounded-full shrink-0", config.dotClass),
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

export default AdminEventStatusBadge;
