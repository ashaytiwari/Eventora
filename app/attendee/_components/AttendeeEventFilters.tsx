import { Search, X, Filter } from "lucide-react";

import { EventStatus } from "@/lib/constants/eventStatus";
import { cn } from "@/lib/utils/common";

interface AttendeeEventFiltersProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  status: EventStatus | "ALL";
  onStatusChange: (status: EventStatus | "ALL") => void;
  totalEvents?: number;
}

const statusOptions: Array<{ label: string; value: EventStatus | "ALL" }> = [
  { label: "All Upcoming", value: "ALL" },
  { label: "Published", value: EventStatus.PUBLISHED },
  { label: "Cancelled", value: EventStatus.CANCELLED },
];

const AttendeeEventFilters = ({
  searchText,
  onSearchChange,
  status,
  onStatusChange,
  totalEvents,
}: AttendeeEventFiltersProps) => {

  const searchInputAttributes = {
    type: "text",
    value: searchText,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onSearchChange(e.target.value),
    placeholder: "Search events by title...",
    className:
      "w-full pl-10 pr-9 py-2.5 bg-dark-100 border border-dark-200 rounded-xl text-sm text-white placeholder:text-light-200/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-sans",
  };

  const clearButtonAttributes = {
    type: "button" as const,
    onClick: () => onSearchChange(""),
    className:
      "absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-light-200 hover:text-white rounded-full hover:bg-dark-200 transition-colors",
  };

  function renderSearchInput() {

    return (
      <div className="relative flex-1 min-w-[260px]">

        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-light-200" />

        <input {...searchInputAttributes} />

        {searchText && (
          <button {...clearButtonAttributes}>
            <X className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    );

  }

  function renderStatusPills() {

    return (
      <div className="flex items-center gap-1.5 p-1 bg-dark-100 border border-dark-200 rounded-xl overflow-x-auto">

        {statusOptions.map((opt) => {
          const isSelected = status === opt.value;

          const buttonAttributes = {
            type: "button" as const,
            onClick: () => onStatusChange(opt.value),
            className: cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200",
              isSelected
                ? "bg-primary text-black font-bold shadow-sm shadow-primary/30"
                : "text-light-200 hover:text-white hover:bg-dark-200"
            ),
          };

          return (
            <button key={opt.value} {...buttonAttributes}>
              {opt.label}
            </button>
          );
        })}

      </div>
    );

  }

  function renderResultsCount() {

    if (typeof totalEvents !== "number") {
      return null;
    }

    return (
      <div className="flex items-center gap-1.5 text-xs text-light-200 font-mono">
        <Filter className="w-3.5 h-3.5 text-primary" />
        <span>
          Showing <strong className="text-white font-semibold">{totalEvents}</strong> events
        </span>
      </div>
    );

  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-dark-100/60 backdrop-blur-xl border border-dark-200 rounded-2xl">

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">

        {renderSearchInput()}

        {renderStatusPills()}

      </div>

      <div className="shrink-0 flex items-center justify-between sm:justify-end">

        {renderResultsCount()}

      </div>

    </div>
  );

};

export default AttendeeEventFilters;
