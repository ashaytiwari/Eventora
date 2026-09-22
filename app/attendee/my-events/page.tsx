"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Ticket, Search, X, Loader2, Sparkles, Filter } from "lucide-react";

import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";
import { UserRole } from "@/lib/constants";
import { EventStatus } from "@/lib/constants/eventStatus";
import { cn } from "@/lib/utils/common";

import { useAttendeeMyEvents } from "../_components/service";

import MyEventCard from "./_components/MyEventCard";

const statusFilterOptions: Array<{ label: string; value: EventStatus | "ALL" }> = [
  { label: "All Registered", value: "ALL" },
  { label: "Published", value: EventStatus.PUBLISHED },
  { label: "Cancelled", value: EventStatus.CANCELLED },
];

export default function MyEventsPage() {

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<EventStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText]);

  const { data, isLoading, isError, refetch } = useAttendeeMyEvents({
    searchText: debouncedSearch,
    status,
    page,
    limit: 12,
  });

  const registrations = data?.registrations || [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const backLinkAttributes = {
    href: "/attendee",
    className:
      "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-light-200 hover:text-white bg-dark-100 hover:bg-dark-200 border border-dark-200 transition-all",
  };

  const searchInputAttributes = {
    type: "text",
    value: searchText,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setSearchText(e.target.value),
    placeholder: "Search your registered events...",
    className:
      "w-full pl-10 pr-9 py-2.5 bg-dark-100 border border-dark-200 rounded-xl text-sm text-white placeholder:text-light-200/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-sans",
  };

  const clearButtonAttributes = {
    type: "button" as const,
    onClick: () => setSearchText(""),
    className:
      "absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-light-200 hover:text-white rounded-full hover:bg-dark-200 transition-colors",
  };

  function renderHeader() {

    return (
      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <Link {...backLinkAttributes}>
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/30">
            <Ticket className="w-3.5 h-3.5" />
            <span>My Registrations</span>
          </div>

        </div>

        <div className="relative overflow-hidden rounded-3xl bg-dark-100 border border-dark-200 p-6 md:p-8 shadow-2xl">

          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-2">

            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Confirmed Spots</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              My Registered Events
            </h1>

            <p className="text-sm text-light-100 leading-relaxed">
              View all the events, conferences, and meetups you have booked. Click any event to check your admission details.
            </p>

          </div>

        </div>

      </div>
    );

  }

  function renderFilters() {

    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-dark-100/60 backdrop-blur-xl border border-dark-200 rounded-2xl">

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">

          <div className="relative flex-1 min-w-[260px]">

            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-light-200" />

            <input {...searchInputAttributes} />

            {searchText && (
              <button {...clearButtonAttributes}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

          </div>

          <div className="flex items-center gap-1.5 p-1 bg-dark-100 border border-dark-200 rounded-xl overflow-x-auto">

            {statusFilterOptions.map((opt) => {
              const isSelected = status === opt.value;

              const buttonAttributes = {
                type: "button" as const,
                onClick: () => {
                  setStatus(opt.value);
                  setPage(1);
                },
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

        </div>

        <div className="shrink-0 flex items-center justify-between sm:justify-end text-xs text-light-200 font-mono">

          <Filter className="w-3.5 h-3.5 text-primary mr-1.5" />

          <span>
            Total: <strong className="text-white font-semibold">{total}</strong> registrations
          </span>

        </div>

      </div>
    );

  }

  function renderLoadingSkeletons() {

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-dark-100/40 border border-dark-200 overflow-hidden animate-pulse h-80 flex flex-col justify-between p-4"
          >

            <div className="w-full h-44 bg-dark-200/60 rounded-xl" />

            <div className="space-y-2 mt-4">

              <div className="w-3/4 h-4 bg-dark-200 rounded" />

              <div className="w-1/2 h-3 bg-dark-200/60 rounded" />

            </div>

            <div className="w-full h-8 bg-dark-200/40 rounded-xl mt-4" />

          </div>
        ))}

      </div>
    );

  }

  function renderEmptyState() {

    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-dark-100/40 border border-dark-200 rounded-3xl">

        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
          <Ticket className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-white">No registered events</h3>

        <p className="text-sm text-light-200 max-w-md mt-1 mb-6">
          {debouncedSearch
            ? `No registered events match "${debouncedSearch}".`
            : "You haven't registered for any events yet. Discover upcoming events and reserve your spot today!"}
        </p>

        <Link
          href="/attendee"
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all cursor-pointer"
        >
          Explore Upcoming Events
        </Link>

      </div>
    );

  }

  function renderErrorState() {

    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-rose-500/5 border border-rose-500/20 rounded-3xl space-y-4">

        <h3 className="text-lg font-bold text-rose-400">Failed to load your events</h3>

        <p className="text-sm text-light-200 max-w-md">
          An error occurred while fetching your registrations. Please try again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all cursor-pointer"
        >
          Retry
        </button>

      </div>
    );

  }

  function renderPagination() {

    if (totalPages <= 1) {
      return null;
    }

    return (
      <div className="flex items-center justify-center gap-3 pt-6">

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-light-100 bg-dark-100 hover:bg-dark-200 border border-dark-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <span className="text-xs text-light-200 font-mono">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-light-100 bg-dark-100 hover:bg-dark-200 border border-dark-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>

      </div>
    );

  }

  function renderEventsContent() {

    if (isLoading) {
      return renderLoadingSkeletons();
    }

    if (isError) {
      return renderErrorState();
    }

    if (registrations.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {registrations.map((reg) => (
            <MyEventCard key={reg._id} registration={reg} />
          ))}

        </div>

        {renderPagination()}

      </div>
    );

  }

  return (
    <ProtectedRouteAuthGuard allowedRoles={[UserRole.EVENT_ATTENDEE]}>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {renderHeader()}

        {renderFilters()}

        {renderEventsContent()}

      </div>

    </ProtectedRouteAuthGuard>
  );

}
