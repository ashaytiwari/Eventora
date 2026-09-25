import Link from "next/link";
import { ArrowLeft, Edit, Sparkles, ChevronDown } from "lucide-react";

import { EventStatus } from "@/lib/constants/eventStatus";
import { IEventDetail } from "@/app/organizer/_components/types";
import { useUpdateOrganizerEventStatus } from "@/app/organizer/_components/service";
import EventStatusBadge from "@/app/organizer/_components/EventStatusBadge";


interface OrganizerEventHeaderProps {
  event: IEventDetail;
}

const OrganizerEventHeader = ({ event }: OrganizerEventHeaderProps) => {

  const updateStatusMutation = useUpdateOrganizerEventStatus();

  const backLinkAttributes = {
    href: "/organizer",
    className:
      "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-light-200 hover:text-white bg-dark-100 hover:bg-dark-200 border border-dark-200 transition-all cursor-pointer",
  };

  const editLinkAttributes = {
    href: `/organizer/events/editor?id=${event._id}`,
    className:
      "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 cursor-pointer",
  };

  function handleStatusSelect(newStatus: EventStatus) {

    if (newStatus === event.status) {
      return;
    }

    updateStatusMutation.mutate({
      eventId: event._id,
      status: newStatus,
    });

  }

  function renderStatusControl() {

    return (
      <div className="relative inline-flex items-center">

        <select
          value={event.status}
          disabled={updateStatusMutation.isPending}
          onChange={(e) => handleStatusSelect(e.target.value as EventStatus)}
          className="appearance-none bg-dark-100 border border-dark-200 hover:border-primary/40 text-xs font-medium text-white px-3.5 py-2 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer disabled:opacity-50"
        >
          <option value={EventStatus.PUBLISHED}>Status: Published</option>
          <option value={EventStatus.DRAFT}>Status: Draft</option>
          <option value={EventStatus.INACTIVE}>Status: Inactive</option>
          <option value={EventStatus.CANCELLED}>Status: Cancelled</option>
        </select>

        <ChevronDown className="w-3.5 h-3.5 text-light-200 absolute right-2.5 pointer-events-none" />

      </div>
    );

  }

  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-dark-200">

      <div className="flex items-center justify-between">

        <Link {...backLinkAttributes}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Events</span>
        </Link>

        <div className="flex items-center gap-3">

          <EventStatusBadge status={event.status} />

        </div>

      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div className="space-y-1">

          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Event Management</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {event.title}
          </h1>

        </div>

        <div className="flex flex-wrap items-center gap-3">

          {renderStatusControl()}

          <Link {...editLinkAttributes}>
            <Edit className="w-4 h-4" />
            <span>Edit Event</span>
          </Link>

        </div>

      </div>

    </div>
  );

};

export default OrganizerEventHeader;
