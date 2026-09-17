import { ChevronDown, Loader2 } from "lucide-react";

import { UserStatus } from "@/lib/constants";
import { cn } from "@/lib/utils/common";

import { useUpdateUserStatus } from "./service";

interface UserStatusSelectorProps {
  userId: string;
  currentStatus: UserStatus;
  size?: "sm" | "md";
}

const statusColorStyles: Record<UserStatus, { selectBg: string; text: string; border: string }> = {
  [UserStatus.ACTIVE]: {
    selectBg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  [UserStatus.SUSPENDED]: {
    selectBg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
  },
};

const statusList = [
  { value: UserStatus.ACTIVE, label: "Active" },
  { value: UserStatus.SUSPENDED, label: "Suspended" },
];

const UserStatusSelector = ({
  userId,
  currentStatus,
  size = "sm",
}: UserStatusSelectorProps) => {

  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  const styleConfig = statusColorStyles[currentStatus] || statusColorStyles[UserStatus.ACTIVE];

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {

    const newStatus = e.target.value as UserStatus;
    if (newStatus === currentStatus) {
      return;
    }

    updateStatus({ userId, status: newStatus });

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

export default UserStatusSelector;
