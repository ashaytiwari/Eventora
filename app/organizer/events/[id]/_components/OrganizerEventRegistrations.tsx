import React, { useState } from "react";
import {
  Users,
  Search,
  X,
  Calendar,
  Mail,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Inbox,
  Filter,
} from "lucide-react";
import { IEventRegistrationItem, IPaginationData } from "@/app/organizer/_components/types";


interface OrganizerEventRegistrationsProps {
  registrations: IEventRegistrationItem[];
  summary: {
    totalRegistrations: number;
    totalAttendees: number;
  };
  pagination: IPaginationData;
  searchText: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const OrganizerEventRegistrations = ({
  registrations,
  summary,
  pagination,
  searchText,
  onSearchChange,
  onPageChange,
  isLoading,
}: OrganizerEventRegistrationsProps) => {

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  function toggleRowExpanded(id: string) {

    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

  }

  const searchInputAttributes = {
    type: "text",
    value: searchText,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onSearchChange(e.target.value),
    placeholder: "Search by attendee name, email, or member name...",
    className:
      "w-full pl-10 pr-9 py-2.5 bg-dark-100 border border-dark-200 rounded-xl text-sm text-white placeholder:text-light-200/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-sans",
  };

  const clearButtonAttributes = {
    type: "button" as const,
    onClick: () => onSearchChange(""),
    className:
      "absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-light-200 hover:text-white rounded-full hover:bg-dark-200 transition-colors",
  };

  function renderSearchAndSummary() {

    return (
      <div className="p-4 bg-dark-100/60 backdrop-blur-xl border border-dark-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">

        <div className="relative flex-1 min-w-[280px]">

          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-light-200" />

          <input {...searchInputAttributes} />

          {searchText && (
            <button {...clearButtonAttributes}>
              <X className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-light-200 shrink-0">

          <div className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-primary" />
            <span>
              Bookings: <strong className="text-white">{summary.totalRegistrations}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" />
            <span>
              Total Guests: <strong className="text-white">{summary.totalAttendees}</strong>
            </span>
          </div>

        </div>

      </div>
    );

  }

  function renderMemberPills(members: IEventRegistrationItem["attendeeDetails"]) {

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-3">

        {members.map((member, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-dark-200/60 border border-border-dark flex items-center justify-between text-xs"
          >

            <div className="space-y-0.5 truncate">

              <p className="font-semibold text-white truncate">{member.fullName}</p>

              <p className="text-[11px] text-light-200">
                Age: {member.age} • {member.gender}
              </p>

            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-dark-100 text-light-200 border border-border-dark">
              #{idx + 1}
            </span>

          </div>
        ))}

      </div>
    );

  }

  function renderRegistrationCard(item: IEventRegistrationItem) {

    const isExpanded = expandedRows[item._id] ?? true;
    const registeredDate = new Date(item.registeredAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const userInitials =
      `${item.user?.firstname?.[0] || ""}${item.user?.lastname?.[0] || ""}`.toUpperCase() ||
      "U";

    const memberCount = item.attendeeDetails?.length || item.totalAttendees || 1;

    return (
      <div
        key={item._id}
        className="p-5 rounded-2xl bg-dark-100/90 border border-dark-200 hover:border-primary/30 transition-all space-y-3"
      >

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div className="flex items-center gap-3.5">

            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 font-mono">
              {userInitials}
            </div>

            <div className="space-y-0.5">

              <h4 className="text-sm font-bold text-white">
                {item.user?.firstname} {item.user?.lastname}
              </h4>

              <div className="flex items-center gap-2 text-xs text-light-200">

                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  {item.user?.email}
                </span>

              </div>

            </div>

          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">

            <div className="text-right space-y-0.5">

              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 font-mono">
                <Users className="w-3.5 h-3.5" />
                <span>{memberCount} {memberCount === 1 ? "Member" : "Members"}</span>
              </div>

              <p className="text-[11px] text-light-200 font-mono flex items-center gap-1 justify-end">
                <Calendar className="w-3 h-3 text-light-200/70" />
                <span>{registeredDate}</span>
              </p>

            </div>

            <button
              type="button"
              onClick={() => toggleRowExpanded(item._id)}
              className="p-1.5 text-light-200 hover:text-white rounded-lg hover:bg-dark-200 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

          </div>

        </div>

        {isExpanded && item.attendeeDetails && item.attendeeDetails.length > 0 && (
          <div className="pt-2 border-t border-border-dark">

            <span className="text-[11px] font-mono text-light-200 uppercase tracking-wider">
              Guest Members Breakdown ({item.attendeeDetails.length})
            </span>

            {renderMemberPills(item.attendeeDetails)}

          </div>
        )}

      </div>
    );

  }

  function renderEmptyState() {

    return (
      <div className="py-16 px-6 flex flex-col items-center justify-center text-center gap-4 bg-dark-100/40 border border-dark-200 rounded-3xl">

        <div className="w-14 h-14 rounded-2xl bg-dark-200/60 border border-border-dark flex items-center justify-center text-light-200/60">
          <Inbox className="w-7 h-7" />
        </div>

        <div className="space-y-1 max-w-sm">

          <h4 className="text-base font-semibold text-white">
            {searchText ? "No matching registrations found" : "No attendees registered yet"}
          </h4>

          <p className="text-xs text-light-200">
            {searchText
              ? "Try adjusting your search term to find registered attendees."
              : "When users register for your event, their details and member breakdowns will appear here."}
          </p>

        </div>

        {searchText && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-dark-200 text-light-100 hover:text-white border border-border-dark transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        )}

      </div>
    );

  }

  function renderPagination() {

    if (pagination.totalPages <= 1) {
      return null;
    }

    return (
      <div className="flex items-center justify-center gap-3 pt-6">

        <button
          type="button"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-light-100 bg-dark-100 hover:bg-dark-200 border border-dark-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Previous
        </button>

        <span className="text-xs text-light-200 font-mono">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          type="button"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-light-100 bg-dark-100 hover:bg-dark-200 border border-dark-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
        </button>

      </div>
    );

  }

  function renderListContent() {

    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-5 rounded-2xl bg-dark-100/40 border border-dark-200 animate-pulse h-28"
            />
          ))}
        </div>
      );
    }

    if (registrations.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="space-y-4">

        {registrations.map((item) => renderRegistrationCard(item))}

        {renderPagination()}

      </div>
    );

  }

  return (
    <div className="space-y-6">

      {renderSearchAndSummary()}

      {renderListContent()}

    </div>
  );

};

export default OrganizerEventRegistrations;
