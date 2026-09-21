import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Globe,
  Building2,
  Users,
  Tag,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

import { EventStatus } from "@/lib/constants/eventStatus";
import { cn } from "@/lib/utils/common";

import { AttendeeEvent } from "@/app/attendee/_components/types";

interface AttendeeEventDetailsProps {
  event: AttendeeEvent;
  isRegistered?: boolean;
  onRegisterClick: () => void;
}

const AttendeeEventDetails = ({
  event,
  isRegistered = false,
  onRegisterClick,
}: AttendeeEventDetailsProps) => {

  const startDate = new Date(event.startAt);
  const endDate = new Date(event.endAt);

  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedStartTime = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedEndTime = endDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isCancelled = event.status === EventStatus.CANCELLED;
  const isPublished = event.status === EventStatus.PUBLISHED;
  const isPast = endDate <= new Date();
  const canRegister = isPublished && !isPast && !isCancelled && !isRegistered;

  const backLinkAttributes = {
    href: "/attendee",
    className:
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-light-200 hover:text-white hover:bg-dark-100 border border-dark-200 transition-all",
  };

  const registerBtnAttributes = {
    type: "button" as const,
    onClick: onRegisterClick,
    disabled: !canRegister,
    className: cn(
      "w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold shadow-xl transition-all",
      isRegistered
        ? "bg-primary/20 text-primary border border-primary/40 cursor-default"
        : canRegister
        ? "bg-primary hover:bg-primary/90 text-black shadow-primary/20 active:scale-95 cursor-pointer"
        : "bg-dark-200 text-light-200/50 cursor-not-allowed border border-border-dark"
    ),
  };

  function renderStatusBadge() {

    if (isRegistered) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/50 shadow-sm shadow-primary/20">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>You're Registered</span>
        </div>
      );
    }

    if (isCancelled) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Cancelled Event</span>
        </div>
      );
    }

    if (isPast) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-dark-200 text-light-200 border border-border-dark">
          <Clock className="w-4 h-4" />
          <span>Past Event</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/40">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>Published & Upcoming</span>
      </div>
    );

  }

  function renderHeaderBanner() {

    return (
      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <Link {...backLinkAttributes}>
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>

          {renderStatusBadge()}

        </div>

        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden border border-dark-200 bg-dark-100 shadow-2xl">

          <Image
            src={
              event.image ||
              "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop&q=80"
            }
            alt={event.title}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-dark-100/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 space-y-2">

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              {event.title}
            </h1>

            {event.organization?.organizationName && (
              <p className="text-sm sm:text-base text-primary font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Organized by {event.organization.organizationName}</span>
              </p>
            )}

          </div>

        </div>

      </div>
    );

  }

  function renderRegisteredAlert() {

    if (!isRegistered) {
      return null;
    }

    return (
      <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-start gap-3 text-primary">

        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />

        <div className="space-y-1">

          <h4 className="text-sm font-bold text-white">
            You are registered for this event!
          </h4>

          <p className="text-xs text-light-100 leading-relaxed">
            Your registration is confirmed. We look forward to seeing you at the event.
          </p>

        </div>

      </div>
    );

  }

  function renderCancellationAlert() {

    if (!isCancelled) {
      return null;
    }

    return (
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300">

        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />

        <div className="space-y-1">

          <h4 className="text-sm font-bold text-rose-200">
            This Event Has Been Cancelled
          </h4>

          <p className="text-xs text-rose-300/80 leading-relaxed">
            The organizer has marked this event as cancelled. Registrations are currently closed.
          </p>

        </div>

      </div>
    );

  }

  function renderEventMetadataGrid() {

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="p-4 rounded-2xl bg-dark-100/80 border border-dark-200 flex items-start gap-3">

          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">

            <span className="text-xs text-light-200 font-medium">Date & Schedule</span>

            <p className="text-sm font-semibold text-white">{formattedStartDate}</p>

            <p className="text-xs text-light-200 font-mono">
              {formattedStartTime} - {formattedEndTime}
            </p>

          </div>

        </div>

        <div className="p-4 rounded-2xl bg-dark-100/80 border border-dark-200 flex items-start gap-3">

          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            {event.isVirtualEvent ? (
              <Video className="w-5 h-5 text-blue" />
            ) : (
              <MapPin className="w-5 h-5 text-primary" />
            )}
          </div>

          <div className="space-y-0.5">

            <span className="text-xs text-light-200 font-medium">Location & Mode</span>

            <p className="text-sm font-semibold text-white">
              {event.isVirtualEvent ? "Online Virtual Event" : (event.eventLocation || "Venue TBA")}
            </p>

            {event.isVirtualEvent && event.virtualEventLink && (
              <a
                href={event.virtualEventLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue hover:underline inline-flex items-center gap-1"
              >
                <span>Access Meeting Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

          </div>

        </div>

      </div>
    );

  }

  function renderAboutSection() {

    return (
      <div className="p-6 rounded-3xl bg-dark-100/60 border border-dark-200 space-y-4">

        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>About This Event</span>
        </h3>

        <div className="text-sm text-light-100 leading-relaxed whitespace-pre-line space-y-2">
          {event.about}
        </div>

        {event.seoTags && event.seoTags.length > 0 && (
          <div className="pt-4 border-t border-border-dark flex flex-wrap items-center gap-2">

            <Tag className="w-3.5 h-3.5 text-primary" />

            {event.seoTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-dark-200 text-light-100 text-xs font-mono border border-border-dark"
              >
                #{tag}
              </span>
            ))}

          </div>
        )}

      </div>
    );

  }

  function renderArtistSection() {

    if (!event.artist?.name) {
      return null;
    }

    return (
      <div className="p-6 rounded-3xl bg-dark-100/60 border border-dark-200 space-y-4">

        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span>Featured Speaker / Artist</span>
        </h3>

        <div className="flex items-center gap-4">

          {event.artist.image ? (
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/50 shadow-md">
              <Image
                src={event.artist.image}
                alt={event.artist.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xl">
              {event.artist.name.charAt(0)}
            </div>
          )}

          <div>

            <h4 className="text-base font-bold text-white">
              {event.artist.name}
            </h4>

            <p className="text-xs text-light-200">Keynote Performer / Speaker</p>

          </div>

        </div>

      </div>
    );

  }

  function renderOrganizerSection() {

    if (!event.organization?.organizationName) {
      return null;
    }

    return (
      <div className="p-6 rounded-3xl bg-dark-100/60 border border-dark-200 space-y-4">

        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <span>Organizer Details</span>
        </h3>

        <div className="space-y-2">

          <h4 className="text-base font-bold text-white">
            {event.organization.organizationName}
          </h4>

          {event.organization.tagLine && (
            <p className="text-xs text-primary font-medium">
              {event.organization.tagLine}
            </p>
          )}

          {event.organization.about && (
            <p className="text-xs text-light-200 leading-relaxed">
              {event.organization.about}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-light-200">

            {event.organization.website && (
              <a
                href={event.organization.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Official Website</span>
              </a>
            )}

            {event.organization.address && (
              <span className="inline-flex items-center gap-1.5 text-light-200">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{event.organization.address}</span>
              </span>
            )}

          </div>

        </div>

      </div>
    );

  }

  function renderSidebarRegistrationCard() {

    return (
      <div className="sticky top-24 p-6 rounded-3xl bg-dark-100/90 backdrop-blur-xl border border-dark-200 shadow-2xl space-y-6">

        <div className="space-y-2">

          <span className="text-xs font-semibold text-light-200 uppercase tracking-wider">
            Admission & Access
          </span>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">Free</span>
            <span className="text-xs text-light-200 font-medium">/ Open Registration</span>
          </div>

        </div>

        <div className="space-y-3 pt-2 border-t border-border-dark text-xs text-light-100">

          <div className="flex items-center justify-between">
            <span className="text-light-200">Language</span>
            <span className="font-semibold text-white">{event.language || "English"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-light-200">Age Restriction</span>
            <span className="font-semibold text-white">
              {event.ageLimit ? `${event.ageLimit}+ yrs` : "All Ages"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-light-200">Registration Status</span>
            <span className="font-semibold">
              {isRegistered ? (
                <span className="text-primary font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Registered
                </span>
              ) : canRegister ? (
                <span className="text-primary font-mono font-bold">Open</span>
              ) : isCancelled ? (
                <span className="text-rose-400 font-mono">Cancelled</span>
              ) : (
                <span className="text-light-200 font-mono">Closed</span>
              )}
            </span>
          </div>

        </div>

        <button {...registerBtnAttributes}>
          {isRegistered ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Already Registered</span>
            </>
          ) : (
            <>
              <UserCheck className="w-5 h-5" />
              <span>{canRegister ? "Register for Event" : isCancelled ? "Event Cancelled" : "Registration Closed"}</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-light-200 pt-1">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>
            {isRegistered
              ? "You have already secured your spot"
              : "Instant registration with multi-attendee support"}
          </span>
        </div>

      </div>
    );

  }

  return (
    <div className="space-y-8">

      {renderHeaderBanner()}

      {renderRegisteredAlert()}

      {renderCancellationAlert()}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-8 space-y-6">

          {renderEventMetadataGrid()}

          {renderAboutSection()}

          {renderArtistSection()}

          {renderOrganizerSection()}

        </div>

        <div className="lg:col-span-4">

          {renderSidebarRegistrationCard()}

        </div>

      </div>

    </div>
  );

};

export default AttendeeEventDetails;
