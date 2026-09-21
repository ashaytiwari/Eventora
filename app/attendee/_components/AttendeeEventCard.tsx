import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Video, Building2, ArrowRight, Sparkles, AlertTriangle } from "lucide-react";

import { EventStatus } from "@/lib/constants/eventStatus";

import { AttendeeEvent } from "./types";

interface AttendeeEventCardProps {
  event: AttendeeEvent;
}

const AttendeeEventCard = ({ event }: AttendeeEventCardProps) => {

  const startDate = new Date(event.startAt);
  const formattedDate = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isCancelled = event.status === EventStatus.CANCELLED;

  const cardContainerAttributes = {
    href: `/attendee/events/${event._id}`,
    className:
      "group relative flex flex-col bg-dark-100/90 backdrop-blur-xl border border-dark-200 hover:border-primary/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(93,254,202,0.12)] hover:-translate-y-1 block",
  };

  const imageWrapperAttributes = {
    className: "relative w-full h-48 sm:h-52 overflow-hidden bg-dark-200/80",
  };

  const imageAttributes = {
    src: event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80",
    alt: event.title,
    fill: true,
    className:
      "object-cover transition-transform duration-500 group-hover:scale-105",
  };

  function renderStatusBadge() {

    if (isCancelled) {
      return (
        <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/90 text-white backdrop-blur-md shadow-lg shadow-rose-950/40 border border-rose-400/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Cancelled</span>
        </div>
      );
    }

    return (
      <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/90 text-black backdrop-blur-md shadow-lg shadow-emerald-950/30 border border-primary/40">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Published</span>
      </div>
    );

  }

  function renderDateBadge() {

    return (
      <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-dark-100/90 text-primary backdrop-blur-md border border-primary/30 font-mono">
        <Calendar className="w-3.5 h-3.5 text-primary" />
        <span>{formattedDate}</span>
      </div>
    );

  }

  function renderImageSection() {

    return (
      <div {...imageWrapperAttributes}>

        {renderDateBadge()}

        {renderStatusBadge()}

        <Image {...imageAttributes} />

        <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent opacity-80" />

      </div>
    );

  }

  function renderLocationInfo() {

    if (event.isVirtualEvent) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-blue font-medium">
          <Video className="w-3.5 h-3.5 shrink-0" />
          <span>Virtual Event</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 text-xs text-light-200 truncate">
        <MapPin className="w-3.5 h-3.5 text-primary/80 shrink-0" />
        <span className="truncate">{event.eventLocation || "Venue TBA"}</span>
      </div>
    );

  }

  function renderOrganizerInfo() {

    if (!event.organization?.organizationName) {
      return null;
    }

    return (
      <div className="flex items-center gap-1.5 text-xs text-light-200 truncate">
        <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="truncate">{event.organization.organizationName}</span>
      </div>
    );

  }

  function renderCardFooter() {

    return (
      <div className="mt-4 pt-3 border-t border-border-dark flex items-center justify-between text-xs font-medium text-light-200 group-hover:text-primary transition-colors">

        <span>View Full Details</span>

        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />

      </div>
    );

  }

  function renderTags() {

    if (!event.seoTags || event.seoTags.length === 0) {
      return null;
    }

    const visibleTags = event.seoTags.slice(0, 2);

    return (
      <div className="flex flex-wrap items-center gap-1.5 mt-2">

        {visibleTags.map((tag, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded-md bg-dark-200 text-light-200 text-[10px] font-mono border border-border-dark"
          >
            #{tag}
          </span>
        ))}

        {event.seoTags.length > 2 && (
          <span className="text-[10px] text-light-200">
            +{event.seoTags.length - 2}
          </span>
        )}

      </div>
    );

  }

  return (
    <Link {...cardContainerAttributes}>

      {renderImageSection()}

      <div className="p-4 flex-1 flex flex-col justify-between">

        <div>

          <div className="flex items-center justify-between gap-2 mb-1.5">

            {renderLocationInfo()}

            <span className="text-xs text-light-200 font-mono">
              {formattedTime}
            </span>

          </div>

          <h3 className="font-semibold text-white text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          <div className="mt-2 space-y-1">

            {renderOrganizerInfo()}

          </div>

          {renderTags()}

        </div>

        {renderCardFooter()}

      </div>

    </Link>
  );

};

export default AttendeeEventCard;
