import { ChevronDown, Loader2 } from "lucide-react";

import { EventStatus } from "@/lib/constants/eventStatus";
import { cn } from "@/lib/utils/common";

import { useUpdateEventStatus } from "./service";

interface AdminEventStatusSelectorProps {
  eventId: string;
  currentStatus: EventStatus;
  size?: "sm" | "md";
}

const statusColorStyles: Record<EventStatus, { selectBg: string; text: string; border: string }> = {
  [EventStatus.PUBLISHED]: {
    selectBg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  [EventStatus.DRAFT]: {
    selectBg: "bg-amber-500/10",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  [EventStatus.INACTIVE]: {
    selectBg: "bg-slate-500/10",
    text: "text-slate-300",
    border: "border-slate-500/30",
  },
  [EventStatus.CANCELLED]: {
    selectBg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
  },
};

const statusList = [
  { value: EventStatus.PUBLISHED, label: "Published" },
  { value: EventStatus.DRAFT, label: "Draft" },
  { value: EventStatus.INACTIVE, label: "Inactive" },
  { value: EventStatus.CANCELLED, label: "Cancelled" },
];

const AdminEventStatusSelector = ({
  eventId,
  currentStatus,
  size = "sm",
}: AdminEventStatusSelectorProps) => {

  const { mutate: updateStatus, isPending } = useUpdateEventStatus();

  const styleConfig = statusColorStyles[currentStatus] || statusColorStyles[EventStatus.DRAFT];

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {

    const newStatus = e.target.value as EventStatus;
    if (newStatus === currentStatus) {
      return;
    }

    updateStatus({ eventId, status: newStatus });

  }

  const containerAttributes = {
    className: "relative inline-flex items-center",
  };

  const selectAttributes = {
    value: currentStatus,
    onChange: handleStatusChange,
    disabled: isPending,
    className: cn(
      "appearance-none font-mono font-medium rounded-full cursor-pointer transition-all duration-150 pr-7 focus:outline-none focus:ring-1 focus:ring-primary/50",
      styleConfig.selectBg,
      styleConfig.text,
      styleConfig.border,
      "border backdrop-blur-sm",
      size === "sm" ? "text-xs py-1 pl-3" : "text-sm py-1.5 pl-4",
      isPending && "opacity-60 cursor-not-allowed"
    ),
  };

  const iconAttributes = {
    className: cn(
      "absolute right-2 pointer-events-none transition-colors",
      styleConfig.text,
      isPending && "animate-spin"
    ),
  };

  function renderIndicatorIcon() {

    if (isPending) {
      return (
        <Loader2 className="w-3.5 h-3.5" />
      );
    }

    return (
      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
    );

  }

  function renderStatusOptions() {

    return statusList.map((item) => (
      <option
        key={item.value}
        value={item.value}
        className="bg-dark-100 text-light-100 font-sans"
      >
        {item.label}
      </option>
    ));

  }

  return (
    <div {...containerAttributes}>

      <select {...selectAttributes}>

        {renderStatusOptions()}

      </select>

      <div {...iconAttributes}>

        {renderIndicatorIcon()}

      </div>

    </div>
  );

};

export default AdminEventStatusSelector;
