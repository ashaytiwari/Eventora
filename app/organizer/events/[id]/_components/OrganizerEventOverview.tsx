import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Globe,
  Building2,
  Users,
  Tag,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { IEventDetail } from "@/app/organizer/_components/types";

interface OrganizerEventOverviewProps {
  event: IEventDetail;
  totalRegistrations: number;
  totalAttendees: number;
}

const OrganizerEventOverview = ({
  event,
  totalRegistrations,
  totalAttendees,
}: OrganizerEventOverviewProps) => {

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

  function renderMetricsGrid() {

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="p-4 rounded-2xl bg-dark-100 border border-dark-200 flex flex-col gap-1">

          <div className="flex items-center justify-between text-light-200">
            <span className="text-xs font-mono uppercase">Registrations</span>
            <UserCheck className="w-4 h-4 text-primary" />
          </div>

          <span className="text-2xl font-bold font-mono text-white">
            {totalRegistrations}
          </span>

          <span className="text-[11px] text-light-200/70">
            Registered accounts
          </span>

        </div>

        <div className="p-4 rounded-2xl bg-dark-100 border border-dark-200 flex flex-col gap-1">

          <div className="flex items-center justify-between text-light-200">
            <span className="text-xs font-mono uppercase">Total Attendees</span>
            <Users className="w-4 h-4 text-primary" />
          </div>

          <span className="text-2xl font-bold font-mono text-white">
            {totalAttendees}
          </span>

          <span className="text-[11px] text-light-200/70">
            Total guests / members
          </span>

        </div>

        <div className="p-4 rounded-2xl bg-dark-100 border border-dark-200 flex flex-col gap-1">

          <div className="flex items-center justify-between text-light-200">
            <span className="text-xs font-mono uppercase">Format</span>
            {event.isVirtualEvent ? (
              <Video className="w-4 h-4 text-blue" />
            ) : (
              <MapPin className="w-4 h-4 text-primary" />
            )}
          </div>

          <span className="text-lg font-bold text-white truncate">
            {event.isVirtualEvent ? "Virtual Online" : "In-Person Venue"}
          </span>

          <span className="text-[11px] text-light-200/70 truncate">
            {event.isVirtualEvent ? "Online Meeting" : (event.eventLocation || "Venue TBA")}
          </span>

        </div>

        <div className="p-4 rounded-2xl bg-dark-100 border border-dark-200 flex flex-col gap-1">

          <div className="flex items-center justify-between text-light-200">
            <span className="text-xs font-mono uppercase">Language / Age</span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>

          <span className="text-lg font-bold text-white">
            {event.language || "English"}
          </span>

          <span className="text-[11px] text-light-200/70">
            {event.ageLimit ? `Age: ${event.ageLimit}+` : "All Ages Welcome"}
          </span>

        </div>

      </div>
    );

  }

  function renderImageBanner() {

    return (
      <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden border border-dark-200 bg-dark-100 shadow-2xl">

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

        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">

          <div className="space-y-1">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-dark-100/90 text-primary border border-primary/30 font-mono backdrop-blur-md">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedStartDate}</span>
            </div>

            <p className="text-xs text-light-200 font-mono">
              {formattedStartTime} - {formattedEndTime}
            </p>

          </div>

          {event.isVirtualEvent && event.virtualEventLink && (
            <a
              href={event.virtualEventLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-black bg-blue hover:bg-blue/90 shadow-lg shadow-blue/20 transition-all cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Open Meeting Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

        </div>

      </div>
    );

  }

  function renderScheduleAndLocation() {

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="p-5 rounded-2xl bg-dark-100/80 border border-dark-200 flex items-start gap-3.5">

          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Clock className="w-5 h-5" />
          </div>

          <div className="space-y-1">

            <span className="text-xs text-light-200 font-medium">Event Schedule</span>

            <p className="text-sm font-semibold text-white">{formattedStartDate}</p>

            <p className="text-xs text-light-200 font-mono">
              {formattedStartTime} - {formattedEndTime}
            </p>

          </div>

        </div>

        <div className="p-5 rounded-2xl bg-dark-100/80 border border-dark-200 flex items-start gap-3.5">

          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            {event.isVirtualEvent ? (
              <Video className="w-5 h-5 text-blue" />
            ) : (
              <MapPin className="w-5 h-5 text-primary" />
            )}
          </div>

          <div className="space-y-1">

            <span className="text-xs text-light-200 font-medium">Location Details</span>

            <p className="text-sm font-semibold text-white">
              {event.isVirtualEvent ? "Virtual Online Event" : (event.eventLocation || "Venue TBA")}
            </p>

            {event.isVirtualEvent && event.virtualEventLink && (
              <p className="text-xs text-blue truncate max-w-xs font-mono">
                {event.virtualEventLink}
              </p>
            )}

          </div>

        </div>

      </div>
    );

  }

  function renderAboutSection() {

    return (
      <div className="p-6 rounded-3xl bg-dark-100/60 border border-dark-200 space-y-4">

        <h3 className="text-lg font-bold text-white">About Event</h3>

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
      <div className="p-6 rounded-3xl bg-dark-100/60 border border-dark-200 space-y-3">

        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <span>Organizer Profile</span>
        </h3>

        <div className="space-y-1.5">

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

  return (
    <div className="space-y-6">

      {renderMetricsGrid()}

      {renderImageBanner()}

      {renderScheduleAndLocation()}

      {renderAboutSection()}

      {renderArtistSection()}

      {renderOrganizerSection()}

    </div>
  );

};

export default OrganizerEventOverview;
