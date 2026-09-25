"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  FileText,
  Users,
} from "lucide-react";

import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";
import { UserRole } from "@/lib/constants";
import { cn } from "@/lib/utils/common";

import {
  useEventById,
  useEventRegistrations,
} from "../../_components/service";

import OrganizerEventHeader from "./_components/OrganizerEventHeader";
import OrganizerEventOverview from "./_components/OrganizerEventOverview";
import OrganizerEventRegistrations from "./_components/OrganizerEventRegistrations";

type ActiveTab = "OVERVIEW" | "REGISTRATIONS";

export default function OrganizerEventDetailsPage() {

  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const [activeTab, setActiveTab] = useState<ActiveTab>("OVERVIEW");
  const [registrationsSearch, setRegistrationsSearch] = useState("");
  const [registrationsPage, setRegistrationsPage] = useState(1);

  const {
    data: event,
    isLoading: isEventLoading,
    isError: isEventError,
    refetch: refetchEvent,
  } = useEventById(eventId);

  const {
    data: registrationsData,
    isLoading: isRegistrationsLoading,
  } = useEventRegistrations({
    eventId,
    searchText: registrationsSearch,
    page: registrationsPage,
    limit: 10,
  });

  const registrations = registrationsData?.registrations || [];
  const summary = registrationsData?.summary || {
    totalRegistrations: 0,
    totalAttendees: 0,
  };
  const pagination = registrationsData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  function handleTabChange(tab: ActiveTab) {

    setActiveTab(tab);

  }

  function handleRegistrationsSearchChange(value: string) {

    setRegistrationsSearch(value);
    setRegistrationsPage(1);

  }

  function renderLoadingState() {

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">

        <Loader2 className="w-8 h-8 animate-spin text-primary" />

        <p className="text-sm text-light-200 font-mono">
          Loading event details...
        </p>

      </div>
    );

  }

  function renderErrorState() {

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-rose-500/5 border border-rose-500/20 rounded-3xl space-y-4">

        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-rose-300">
          Event Not Found
        </h3>

        <p className="text-sm text-light-200 max-w-md">
          Unable to locate this event or you may not have permission to view it.
        </p>

        <div className="flex items-center gap-3 pt-2">

          <button
            type="button"
            onClick={() => router.push("/organizer")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-light-100 bg-dark-200 hover:bg-dark-200/80 border border-border-dark transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Events</span>
          </button>

          <button
            type="button"
            onClick={() => refetchEvent()}
            className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-primary hover:bg-primary/90 transition-all cursor-pointer"
          >
            Retry
          </button>

        </div>

      </div>
    );

  }

  function renderTabsNavigation() {

    const tabs: Array<{ id: ActiveTab; label: string; icon: typeof FileText; count?: number }> = [
      {
        id: "OVERVIEW",
        label: "Event Overview",
        icon: FileText,
      },
      {
        id: "REGISTRATIONS",
        label: "Registered Attendees",
        icon: Users,
        count: summary.totalRegistrations,
      },
    ];

    return (
      <div className="flex items-center gap-2 border-b border-dark-200 pb-2">

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                isActive
                  ? "bg-primary text-black font-bold shadow-lg shadow-primary/20"
                  : "text-light-200 hover:text-white hover:bg-dark-100"
              )}
            >
              <Icon className="w-4 h-4" />

              <span>{tab.label}</span>

              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-mono",
                    isActive
                      ? "bg-black/20 text-black font-bold"
                      : "bg-dark-200 text-primary"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}

      </div>
    );

  }

  function renderTabContent() {

    if (activeTab === "OVERVIEW") {
      return (
        <OrganizerEventOverview
          event={event!}
          totalRegistrations={summary.totalRegistrations}
          totalAttendees={summary.totalAttendees}
        />
      );
    }

    return (
      <OrganizerEventRegistrations
        registrations={registrations}
        summary={summary}
        pagination={pagination}
        searchText={registrationsSearch}
        onSearchChange={handleRegistrationsSearchChange}
        onPageChange={setRegistrationsPage}
        isLoading={isRegistrationsLoading}
      />
    );

  }

  return (
    <ProtectedRouteAuthGuard allowedRoles={[UserRole.EVENT_ORGANIZER]}>

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {isEventLoading && renderLoadingState()}

        {isEventError && renderErrorState()}

        {event && (
          <>
            <OrganizerEventHeader event={event} />

            {renderTabsNavigation()}

            {renderTabContent()}
          </>
        )}

      </div>

    </ProtectedRouteAuthGuard>
  );

}
