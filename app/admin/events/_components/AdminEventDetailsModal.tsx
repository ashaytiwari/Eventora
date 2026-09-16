import { useEffect } from "react";
import Image from "next/image";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Globe,
  ExternalLink,
  User,
  Tag,
  Shield,
  Layers,
} from "lucide-react";

import { cn } from "@/lib/utils/common";

import AdminEventStatusSelector from "./AdminEventStatusSelector";
import { IEventListItem } from "./types";

interface AdminEventDetailsModalProps {
  event: IEventListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const AdminEventDetailsModal = ({
  event,
  isOpen,
  onClose,
}: AdminEventDetailsModalProps) => {

  useEffect(() => {

    function handleKeyDown(e: KeyboardEvent) {

      if (e.key === "Escape") {
        onClose();
      }

    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [isOpen, onClose]);

  if (!isOpen || !event) {
    return null;
  }

  function formatFullDateTime(dateStr: string) {

    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  }

  const backdropAttributes = {
    className:
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200",
    onClick: onClose,
  };

  const modalContainerAttributes = {
    className: cn(
      "relative w-full max-w-3xl bg-dark-100 border border-border-dark rounded-2xl shadow-2xl overflow-hidden my-auto",
      "flex flex-col max-h-[90vh] text-left"
    ),
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
  };

  const closeButtonAttributes = {
    type: "button" as const,
    onClick: onClose,
    className:
      "absolute top-4 right-4 z-20 w-9 h-9 rounded-xl bg-dark-200/80 hover:bg-dark-200 text-light-200 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer",
    "aria-label": "Close modal",
  };

  const modalScrollBodyAttributes = {
    className:
      "flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
  };

  function renderBanner() {

    return (
      <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden bg-dark-200 border border-white/10 shrink-0">
        {event?.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-light-200/40 gap-2">
            <Calendar className="w-10 h-10" />

            <span className="text-xs font-mono">No Banner Image</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/30 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-primary">
              Event Details
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {event?.title}
            </h2>
          </div>
        </div>
      </div>
    );

  }

  function renderStatusAndActions() {

    if (!event) {
      return null;
    }

    return (
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-dark-200/50 border border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-light-200">
            Event Status:
          </span>

          <AdminEventStatusSelector
            eventId={event._id}
            currentStatus={event.status}
            size="md"
          />
        </div>

        {event.seoTags && event.seoTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-light-200/60" />

            {event.seoTags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-light-100 bg-dark-200 px-2.5 py-1 rounded-full border border-white/10 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );

  }

  function renderScheduleAndLocation() {

    if (!event) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-dark-200/40 border border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase">
            <Clock className="w-4 h-4" />

            <span>Schedule</span>
          </div>

          <div className="flex flex-col gap-1 text-xs text-light-100">
            <div>
              <span className="text-light-200">Starts: </span>

              <span className="font-mono font-medium text-white">
                {formatFullDateTime(event.startAt)}
              </span>
            </div>

            <div>
              <span className="text-light-200">Ends: </span>

              <span className="font-mono font-medium text-white">
                {formatFullDateTime(event.endAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-dark-200/40 border border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase">
            {event.isVirtualEvent ? (
              <Globe className="w-4 h-4" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}

            <span>{event.isVirtualEvent ? "Virtual Meeting" : "Venue / Location"}</span>
          </div>

          <div className="text-xs text-light-100">
            {event.isVirtualEvent ? (
              event.virtualEventLink ? (
                <a
                  href={event.virtualEventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue hover:underline font-mono break-all"
                >
                  <span>{event.virtualEventLink}</span>

                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <span className="text-light-200">Virtual Event (Link will be provided)</span>
              )
            ) : (
              <span className="font-medium text-white">
                {event.eventLocation || "In-Person Location Not Specified"}
              </span>
            )}
          </div>
        </div>
      </div>
    );

  }

  function renderEventAttributes() {

    if (!event) {
      return null;
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-dark-200/30 border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] font-mono text-light-200 uppercase">
            Format
          </span>

          <span className="text-xs font-semibold text-white">
            {event.isVirtualEvent ? "Online / Virtual" : "In-Person"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-dark-200/30 border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] font-mono text-light-200 uppercase">
            Language
          </span>

          <span className="text-xs font-semibold text-white">
            {event.language || "English"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-dark-200/30 border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] font-mono text-light-200 uppercase">
            Age Limit
          </span>

          <span className="text-xs font-semibold text-white">
            {event.ageLimit ? `${event.ageLimit}+` : "All Ages"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-dark-200/30 border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] font-mono text-light-200 uppercase">
            Organizer ID
          </span>

          <span className="text-xs font-mono font-medium text-primary truncate">
            {event.organizerId}
          </span>
        </div>
      </div>
    );

  }

  function renderArtistSection() {

    if (!event?.artist?.name) {
      return null;
    }

    return (
      <div className="p-4 rounded-xl bg-dark-200/40 border border-white/5 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase">
          <User className="w-4 h-4" />

          <span>Featured Artist / Speaker</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-dark-200 border border-white/10 shrink-0">
            {event.artist.image ? (
              <Image
                src={event.artist.image}
                alt={event.artist.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-light-200/40">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              {event.artist.name}
            </span>

            <span className="text-xs text-light-200">Host / Performer</span>
          </div>
        </div>
      </div>
    );

  }

  function renderAboutSection() {

    if (!event?.about) {
      return null;
    }

    return (
      <div className="p-4 rounded-xl bg-dark-200/40 border border-white/5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase">
          <Layers className="w-4 h-4" />

          <span>About This Event</span>
        </div>

        <div className="text-sm text-light-100 leading-relaxed whitespace-pre-line">
          {event.about}
        </div>
      </div>
    );

  }

  function renderMetadataFooter() {

    if (!event) {
      return null;
    }

    return (
      <div className="p-4 rounded-xl bg-dark-200/20 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-light-200 font-mono">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-primary/70" />

          <span>ID: {event._id}</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span>Created: {new Date(event.createdAt).toLocaleDateString("en-US")}</span>

          <span>Updated: {new Date(event.updatedAt).toLocaleDateString("en-US")}</span>
        </div>
      </div>
    );

  }

  function renderModalFooter() {

    return (
      <div className="px-6 py-4 border-t border-border-dark bg-dark-200/30 flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-xl text-xs font-semibold bg-dark-200 text-light-100 hover:text-white border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    );

  }

  return (
    <div {...backdropAttributes}>
      <div {...modalContainerAttributes}>

        <button {...closeButtonAttributes}>
          <X className="w-4 h-4" />
        </button>

        <div {...modalScrollBodyAttributes}>

          {renderBanner()}

          {renderStatusAndActions()}

          {renderScheduleAndLocation()}

          {renderEventAttributes()}

          {renderArtistSection()}

          {renderAboutSection()}

          {renderMetadataFooter()}

        </div>

        {renderModalFooter()}

      </div>
    </div>
  );

};

export default AdminEventDetailsModal;
