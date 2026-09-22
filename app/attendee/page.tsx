"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, Compass, Ticket, ArrowRight } from "lucide-react";

import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";
import { UserRole } from "@/lib/constants";
import { EventStatus } from "@/lib/constants/eventStatus";

import AttendeeEventCard from "./_components/AttendeeEventCard";
import AttendeeEventFilters from "./_components/AttendeeEventFilters";
import { useAttendeeUpcomingEvents } from "./_components/service";

export default function AttendeeEventsPage() {

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<EventStatus | "ALL">("ALL");

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchText]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useAttendeeUpcomingEvents({
    searchText: debouncedSearch,
    status,
    limit: 9,
  });

  const allEvents = data?.pages.flatMap((page) => page.events) || [];
  const totalEvents = data?.pages[0]?.pagination?.total ?? 0;

  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentTarget);

    return () => {
      observer.unobserve(currentTarget);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  function renderHeroHeader() {

    return (
      <div className="relative overflow-hidden rounded-3xl bg-dark-100 border border-dark-200 p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">

        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover & Connect</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Upcoming Events & Experiences
          </h1>

          <p className="text-sm text-light-100 leading-relaxed">
            Browse published and upcoming tech conferences, hackathons, and community meetups. Click any event to view full details and reserve your tickets.
          </p>

        </div>

        <div className="relative z-10 shrink-0">

          <Link
            href="/attendee/my-events"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-bold text-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95 cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>My Registered Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

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
          <Compass className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-white">No events found</h3>

        <p className="text-sm text-light-200 max-w-md mt-1 mb-6">
          {debouncedSearch
            ? `No upcoming events match "${debouncedSearch}". Try tweaking your search keywords or clearing filters.`
            : "There are currently no upcoming events matching the selected status criteria."}
        </p>

        {(debouncedSearch || status !== "ALL") && (
          <button
            type="button"
            onClick={() => {
              setSearchText("");
              setStatus("ALL");
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        )}

      </div>
    );

  }

  function renderErrorState() {

    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-rose-500/5 border border-rose-500/20 rounded-3xl">

        <h3 className="text-lg font-bold text-rose-400">Failed to load events</h3>

        <p className="text-sm text-light-200 max-w-md mt-1 mb-6">
          An error occurred while fetching upcoming events. Please try again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all cursor-pointer"
        >
          Try Again
        </button>

      </div>
    );

  }

  function renderEventsGrid() {

    if (isLoading) {
      return renderLoadingSkeletons();
    }

    if (isError) {
      return renderErrorState();
    }

    if (allEvents.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {allEvents.map((event) => (
            <AttendeeEventCard
              key={event._id}
              event={event}
            />
          ))}

        </div>

        <div ref={observerTarget} className="py-6 flex justify-center">

          {isFetchingNextPage && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-100 border border-dark-200 text-xs text-primary">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Loading more events...</span>
            </div>
          )}

          {!hasNextPage && allEvents.length > 0 && (
            <div className="text-center text-xs text-light-200 font-mono">
              You have reached the end of the upcoming events catalog
            </div>
          )}

        </div>

      </div>
    );

  }

  return (
    <ProtectedRouteAuthGuard allowedRoles={[UserRole.EVENT_ATTENDEE]}>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {renderHeroHeader()}

        <AttendeeEventFilters
          searchText={searchText}
          onSearchChange={setSearchText}
          status={status}
          onStatusChange={setStatus}
          totalEvents={totalEvents}
        />

        {renderEventsGrid()}

      </div>

    </ProtectedRouteAuthGuard>
  );

}