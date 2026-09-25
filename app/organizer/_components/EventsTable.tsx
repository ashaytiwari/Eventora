import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Globe,
  ExternalLink,
  AlertCircle,
  Inbox,
  Plus,
  Edit,
} from "lucide-react";

import { cn } from "@/lib/utils/common";

import EventStatusBadge from "./EventStatusBadge";
import { IEventListItem } from "./types";

interface EventsTableProps {
  events: IEventListItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  isFiltered: boolean;
  onResetFilters: () => void;
}

const EventsTable = ({
  events,
  isLoading,
  isError,
  onRetry,
  isFiltered,
  onResetFilters,
}: EventsTableProps) => {

  const tableContainerAttributes = {
    className:
      "w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
  };

  const tableAttributes = {
    className: "w-full text-left border-collapse min-w-[720px]",
  };

  const retryButtonAttributes = {
    type: "button" as const,
    onClick: onRetry,
    className:
      "px-4 py-2 text-xs font-semibold rounded-lg bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 transition-colors cursor-pointer",
  };

  const clearFiltersButtonAttributes = {
    type: "button" as const,
    onClick: onResetFilters,
    className:
      "px-4 py-2 text-xs font-semibold rounded-lg bg-dark-200 text-light-100 hover:text-white border border-white/10 hover:border-white/20 transition-colors cursor-pointer",
  };

  const createEventLinkAttributes = {
    href: "/organizer/events/editor",
    className:
      "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors shadow-[0_0_12px_rgba(93,254,202,0.3)] cursor-pointer",
  };

  function formatDateRange(startAt: string, endAt: string) {

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    const isSameDay =
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate();

    const startFormatted = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const startTime = startDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const endTime = endDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isSameDay) {
      return `${startFormatted} • ${startTime} - ${endTime}`;
    }

    const endFormatted = endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${startFormatted} - ${endFormatted}`;

  }

  function renderTableHeader() {

    return (
      <thead>
        <tr className="border-b border-border-dark bg-dark-200/40 text-xs font-mono uppercase tracking-wider text-light-200">
          <th className="py-3.5 px-5 font-semibold">Event</th>

          <th className="py-3.5 px-4 font-semibold">Schedule</th>

          <th className="py-3.5 px-4 font-semibold">Format / Location</th>

          <th className="py-3.5 px-4 font-semibold">Status</th>

          <th className="py-3.5 px-5 text-right font-semibold">Action</th>
        </tr>
      </thead>
    );

  }

  function renderEventRow(event: IEventListItem) {

    const rowAttributes = {
      className:
        "border-b border-white/5 hover:bg-dark-200/30 transition-colors duration-150 group",
    };

    const viewLinkAttributes = {
      href: `/organizer/events/${event._id}`,
      className:
        "inline-flex items-center gap-1 text-xs text-light-200 hover:text-white transition-colors py-1 px-2.5 rounded-md hover:bg-dark-200/60 border border-transparent hover:border-white/10",
    };

    const editLinkAttributes = {
      href: `/organizer/events/editor?id=${event._id}`,
      className:
        "inline-flex items-center gap-1 text-xs text-primary hover:text-primary/90 transition-colors py-1 px-2.5 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20 font-medium",
    };

    return (
      <tr key={event._id} {...rowAttributes}>
        <td className="py-4 px-5">
          <div className="flex items-center gap-3.5">
            <Link
              href={`/organizer/events/${event._id}`}
              className="relative w-12 h-12 rounded-xl overflow-hidden bg-dark-200 border border-white/10 shrink-0 block"
            >
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-light-200/40">
                  <Calendar className="w-5 h-5" />
                </div>
              )}
            </Link>

            <div className="flex flex-col gap-1 max-w-[280px]">
              <Link href={`/organizer/events/${event._id}`}>
                <span className="font-semibold text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {event.title}
                </span>
              </Link>

              {event.seoTags && event.seoTags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {event.seoTags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-light-200/80 bg-dark-200/80 px-2 py-0.5 rounded-full border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}

                  {event.seoTags.length > 2 && (
                    <span className="text-[10px] text-light-200/50">
                      +{event.seoTags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </td>

        <td className="py-4 px-4 text-xs text-light-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary/70 shrink-0" />

            <span className="font-mono text-light-100">
              {formatDateRange(event.startAt, event.endAt)}
            </span>
          </div>
        </td>

        <td className="py-4 px-4 text-xs text-light-200">
          {event.isVirtualEvent ? (
            <div className="inline-flex items-center gap-1.5 text-blue bg-blue/10 border border-blue/20 px-2.5 py-1 rounded-full text-xs font-mono">
              <Globe className="w-3 h-3" />

              <span>Virtual</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-light-100">
              <MapPin className="w-3.5 h-3.5 text-light-200/70 shrink-0" />

              <span className="truncate max-w-[160px]">
                {event.eventLocation || "In-Person"}
              </span>
            </div>
          )}
        </td>

        <td className="py-4 px-4">
          <EventStatusBadge status={event.status} />
        </td>

        <td className="py-4 px-5 text-right">
          <div className="inline-flex items-center gap-1.5 justify-end">
            <Link {...editLinkAttributes}>
              <Edit className="w-3 h-3" />

              <span>Edit</span>
            </Link>

            <Link {...viewLinkAttributes}>
              <span>View</span>

              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </td>
      </tr>
    );

  }

  function renderLoadingSkeleton() {

    return (
      <tbody>
        {[1, 2, 3, 4, 5].map((item) => (
          <tr key={item} className="border-b border-white/5 animate-pulse">
            <td className="py-4 px-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-dark-200/80 shrink-0" />

                <div className="flex flex-col gap-2 w-48">
                  <div className="h-4 bg-dark-200/80 rounded w-full" />

                  <div className="h-3 bg-dark-200/40 rounded w-2/3" />
                </div>
              </div>
            </td>

            <td className="py-4 px-4">
              <div className="h-3.5 bg-dark-200/60 rounded w-36" />
            </td>

            <td className="py-4 px-4">
              <div className="h-6 bg-dark-200/60 rounded-full w-20" />
            </td>

            <td className="py-4 px-4">
              <div className="h-6 bg-dark-200/60 rounded-full w-24" />
            </td>

            <td className="py-4 px-5 text-right">
              <div className="h-6 bg-dark-200/40 rounded w-14 ml-auto" />
            </td>
          </tr>
        ))}
      </tbody>
    );

  }

  function renderErrorState() {

    return (
      <div className="py-16 px-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1 max-w-sm">
          <h4 className="text-base font-semibold text-white">
            Failed to load events
          </h4>

          <p className="text-xs text-light-200">
            There was an issue fetching your events. Please try again.
          </p>
        </div>

        <button {...retryButtonAttributes}>
          Try Again
        </button>
      </div>
    );

  }

  function renderEmptyState() {

    return (
      <div className="py-16 px-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-dark-200/60 border border-white/10 flex items-center justify-center text-light-200/60">
          <Inbox className="w-7 h-7" />
        </div>

        <div className="flex flex-col gap-1 max-w-sm">
          <h4 className="text-base font-semibold text-white">
            {isFiltered ? "No matching events found" : "No events created yet"}
          </h4>

          <p className="text-xs text-light-200">
            {isFiltered
              ? "Try adjusting your search keywords or status filters."
              : "Get started by hosting and publishing your first event on Eventora."}
          </p>
        </div>

        {isFiltered ? (
          <button {...clearFiltersButtonAttributes}>
            Clear Filters
          </button>
        ) : (
          <Link {...createEventLinkAttributes}>
            <Plus className="w-4 h-4" />

            <span>Create Your First Event</span>
          </Link>
        )}
      </div>
    );

  }

  function renderTableContent() {

    if (isLoading) {
      return renderLoadingSkeleton();
    }

    if (events.length === 0) {
      return null;
    }

    return <tbody>{events.map((event) => renderEventRow(event))}</tbody>;

  }

  if (isError) {
    return renderErrorState();
  }

  return (
    <div className="w-full">
      <div {...tableContainerAttributes}>
        <table {...tableAttributes}>

          {renderTableHeader()}

          {renderTableContent()}

        </table>
      </div>

      {!isLoading && events.length === 0 && renderEmptyState()}
    </div>
  );

};

export default EventsTable;
