"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";

import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";
import { UserRole } from "@/lib/constants";

import EventRegistrationModal from "@/app/attendee/_components/EventRegistrationModal";
import { useAttendeeEventById, useIsEventRegistered } from "@/app/attendee/_components/service";

import AttendeeEventDetails from "./_components/AttendeeEventDetails";

export default function AttendeeEventDetailPage() {

  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const { data: event, isLoading, isError, refetch } = useAttendeeEventById(eventId);
  const { data: isRegisteredData } = useIsEventRegistered(eventId);

  const isRegistered = Boolean(isRegisteredData?.isRegistered);

  function handleOpenRegistration() {

    if (isRegistered) {
      return;
    }

    setIsRegistrationOpen(true);

  }

  function handleCloseRegistration() {

    setIsRegistrationOpen(false);

  }

  function renderLoadingState() {

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">

        <Loader2 className="w-8 h-8 animate-spin text-primary" />

        <p className="text-sm text-light-200 font-mono">Loading event details...</p>

      </div>
    );

  }

  function renderErrorState() {

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-rose-500/5 border border-rose-500/20 rounded-3xl space-y-4">

        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-rose-300">Event not found</h3>

        <p className="text-sm text-light-200 max-w-md">
          The requested event could not be found or has been removed.
        </p>

        <div className="flex items-center gap-3 pt-2">

          <button
            type="button"
            onClick={() => router.push("/attendee")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-light-100 bg-dark-200 hover:bg-dark-200/80 border border-border-dark transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </button>

          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-primary hover:bg-primary/90 transition-all cursor-pointer"
          >
            Retry
          </button>

        </div>

      </div>
    );

  }

  function renderEventContent() {

    if (isLoading) {
      return renderLoadingState();
    }

    if (isError || !event) {
      return renderErrorState();
    }

    return (
      <AttendeeEventDetails
        event={event}
        isRegistered={isRegistered}
        onRegisterClick={handleOpenRegistration}
      />
    );

  }

  return (
    <ProtectedRouteAuthGuard allowedRoles={[UserRole.EVENT_ATTENDEE]}>

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {renderEventContent()}

        <EventRegistrationModal
          isOpen={isRegistrationOpen}
          onClose={handleCloseRegistration}
          event={event || null}
        />

      </div>

    </ProtectedRouteAuthGuard>
  );

}
