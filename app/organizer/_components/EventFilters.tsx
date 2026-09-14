import Link from "next/link";
import { Plus, Search, Filter, RotateCcw, X } from "lucide-react";

import { EventStatus } from "@/lib/constants/eventStatus";
import { cn } from "@/lib/utils/common";

import { EventFilterStatus } from "./types";

interface EventFiltersProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  selectedStatus: EventFilterStatus;
  onStatusChange: (status: EventFilterStatus) => void;
  onResetFilters: () => void;
  totalCount?: number;
}

const statusOptions: { value: EventFilterStatus; label: string }[] = [
  { value: "ALL", label: "All Events" },
  { value: EventStatus.PUBLISHED, label: "Published" },
  { value: EventStatus.DRAFT, label: "Draft" },
  { value: EventStatus.INACTIVE, label: "Inactive" },
  { value: EventStatus.CANCELLED, label: "Cancelled" },
];

const EventFilters = ({
  searchText,
  onSearchTextChange,
  selectedStatus,
  onStatusChange,
  onResetFilters,
  totalCount,
}: EventFiltersProps) => {

  const isFiltered = searchText.trim().length > 0 || selectedStatus !== "ALL";

  const addEventLinkAttributes = {
    href: "/organizer/events/editor",
    className: cn(
      "w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-semibold text-black text-sm sm:text-base",
      "bg-primary hover:bg-primary/90 transition-all duration-200 cursor-pointer",
      "shadow-[0_0_20px_rgba(93,254,202,0.35)] hover:shadow-[0_0_30px_rgba(93,254,202,0.5)] active:scale-[0.99]"
    ),
  };

  const cardAttributes = {
    className:
      "bg-dark-100/70 backdrop-blur-xl border border-border-dark rounded-2xl p-5 card-shadow flex flex-col gap-6",
  };

  const searchInputAttributes = {
    type: "text",
    value: searchText,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onSearchTextChange(e.target.value),
    placeholder: "Search by event title...",
    className:
      "w-full bg-dark-200/90 text-light-100 placeholder:text-light-200/40 rounded-xl pl-10 pr-10 py-2.5 text-sm border border-white/10 focus:border-primary/60 focus:outline-none transition-colors",
  };

  const clearSearchButtonAttributes = {
    type: "button" as const,
    onClick: () => onSearchTextChange(""),
    className:
      "absolute right-3 top-1/2 -translate-y-1/2 text-light-200 hover:text-white transition-colors cursor-pointer",
    "aria-label": "Clear search",
  };

  const resetButtonAttributes = {
    type: "button" as const,
    onClick: onResetFilters,
    className:
      "flex items-center gap-1.5 text-xs text-light-200 hover:text-primary transition-colors cursor-pointer",
  };

  function renderAddEventButton() {

    return (
      <Link {...addEventLinkAttributes}>
        <Plus className="w-5 h-5 stroke-[2.5]" />

        <span>Add New Event</span>
      </Link>
    );

  }

  function renderFilterHeader() {

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />

          <h3 className="text-base font-semibold text-white">Filter Events</h3>
        </div>

        {isFiltered && (
          <button {...resetButtonAttributes}>
            <RotateCcw className="w-3.5 h-3.5" />

            <span>Reset</span>
          </button>
        )}
      </div>
    );

  }

  function renderTitleFilter() {

    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono uppercase tracking-wider text-light-200">
          Event Title
        </label>

        <div className="relative">
          <Search className="w-4 h-4 text-light-200/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

          <input {...searchInputAttributes} />

          {searchText.length > 0 && (
            <button {...clearSearchButtonAttributes}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );

  }

  function renderStatusFilter() {

    return (
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-mono uppercase tracking-wider text-light-200">
          Status
        </label>

        <div className="flex flex-col gap-1.5">
          {statusOptions.map((option) => {

            const isSelected = selectedStatus === option.value;

            const buttonAttributes = {
              type: "button" as const,
              onClick: () => onStatusChange(option.value),
              className: cn(
                "flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer border text-left",
                isSelected
                  ? "bg-primary/15 text-primary border-primary/40 shadow-[0_0_12px_rgba(93,254,202,0.15)] font-semibold"
                  : "bg-dark-200/40 text-light-200 hover:text-white hover:bg-dark-200/80 border-white/5"
              ),
            };

            return (
              <button key={option.value} {...buttonAttributes}>
                <span>{option.label}</span>

                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_rgba(93,254,202,0.9)]" />
                )}
              </button>
            );

          })}
        </div>
      </div>
    );

  }

  function renderSummaryInfo() {

    if (totalCount === undefined) {
      return null;
    }

    return (
      <div className="pt-2 border-t border-border-dark flex items-center justify-between text-xs text-light-200">
        <span>Matching Events</span>

        <span className="font-mono text-white bg-dark-200/80 px-2 py-0.5 rounded-md border border-white/5">
          {totalCount}
        </span>
      </div>
    );

  }

  return (
    <div className="flex flex-col gap-5 w-full">

      {renderAddEventButton()}

      <div {...cardAttributes}>

        {renderFilterHeader()}

        {renderTitleFilter()}

        {renderStatusFilter()}

        {renderSummaryInfo()}

      </div>

    </div>
  );

};

export default EventFilters;
