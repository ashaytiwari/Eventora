import React, { useState } from "react";
import { X, UserPlus, Trash2, Calendar, MapPin, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

import { Gender } from "@/lib/constants/gender";
import { cn } from "@/lib/utils/common";

import { useRegisterForEvent } from "./service";
import { AttendeeEvent, AttendeeMember } from "./types";

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: AttendeeEvent | null;
}

const defaultMember: AttendeeMember = {
  fullName: "",
  age: "",
  gender: Gender.MALE,
};

const EventRegistrationModal = ({
  isOpen,
  onClose,
  event,
}: EventRegistrationModalProps) => {

  const [attendees, setAttendees] = useState<AttendeeMember[]>([{ ...defaultMember }]);
  const [formErrors, setFormErrors] = useState<string | null>(null);

  const registerMutation = useRegisterForEvent(() => {
    handleClose();
  });

  if (!isOpen || !event) {
    return null;
  }

  function handleClose() {

    setAttendees([{ ...defaultMember }]);
    setFormErrors(null);
    onClose();

  }

  function handleAddMember() {

    setAttendees((prev) => [...prev, { ...defaultMember }]);

  }

  function handleRemoveMember(index: number) {

    if (attendees.length === 1) {
      return;
    }

    setAttendees((prev) => prev.filter((_, idx) => idx !== index));

  }

  function handleMemberChange(
    index: number,
    field: keyof AttendeeMember,
    value: any
  ) {

    setAttendees((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: value,
      };
      return next;
    });

  }

  function validateForm(): boolean {

    setFormErrors(null);

    for (let i = 0; i < attendees.length; i++) {
      const item = attendees[i];
      if (!item.fullName.trim() || item.fullName.trim().length < 2) {
        setFormErrors(`Attendee #${i + 1}: Full name must be at least 2 characters.`);
        return false;
      }
      const ageNum = Number(item.age);
      if (!item.age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        setFormErrors(`Attendee #${i + 1}: Please provide a valid age between 1 and 120.`);
        return false;
      }
      if (!Object.values(Gender).includes(item.gender)) {
        setFormErrors(`Attendee #${i + 1}: Please select a valid gender.`);
        return false;
      }
    }

    return true;

  }

  function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payloadAttendees = attendees.map((a) => ({
      fullName: a.fullName.trim(),
      age: Number(a.age),
      gender: a.gender,
    }));

    registerMutation.mutate({
      eventId: event!._id,
      attendees: payloadAttendees,
    });

  }

  const backdropAttributes = {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in",
    onClick: handleClose,
  };

  const modalContainerAttributes = {
    className:
      "relative w-full max-w-2xl bg-dark-100 border border-dark-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto",
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
  };

  const closeButtonAttributes = {
    type: "button" as const,
    onClick: handleClose,
    className:
      "p-2 text-light-200 hover:text-white rounded-xl hover:bg-dark-200 transition-colors",
  };

  const addMemberButtonAttributes = {
    type: "button" as const,
    onClick: handleAddMember,
    className:
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-all active:scale-95",
  };

  const submitButtonAttributes = {
    type: "submit" as const,
    disabled: registerMutation.isPending,
    className: cn(
      "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    ),
  };

  function renderModalHeader() {

    const startDate = new Date(event!.startAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="p-5 border-b border-border-dark bg-dark-100/50 flex items-start justify-between gap-4">

        <div className="space-y-1">

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/30">
            <Sparkles className="w-3 h-3" />
            <span>Event Registration</span>
          </div>

          <h2 className="text-lg font-bold text-white line-clamp-1">
            {event!.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-light-200 pt-0.5">

            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {startDate}
            </span>

            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {event!.isVirtualEvent ? "Virtual Event" : (event!.eventLocation || "In-person")}
            </span>

          </div>

        </div>

        <button {...closeButtonAttributes}>
          <X className="w-5 h-5" />
        </button>

      </div>
    );

  }

  function renderAttendeeRows() {

    return (
      <div className="space-y-4">

        {attendees.map((attendee, index) => {
          const isFirst = index === 0;

          return (
            <div
              key={index}
              className="p-4 rounded-xl bg-dark-200/50 border border-border-dark relative space-y-3"
            >

              <div className="flex items-center justify-between">

                <span className="text-xs font-semibold text-light-100 font-mono">
                  Attendee #{index + 1} {isFirst && "(Primary)"}
                </span>

                {!isFirst && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(index)}
                    className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">

                <div className="sm:col-span-6 space-y-1">

                  <label className="text-xs font-medium text-light-200">
                    Full Name <span className="text-rose-400">*</span>
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={attendee.fullName}
                    onChange={(e) =>
                      handleMemberChange(index, "fullName", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-dark-100 border border-border-dark rounded-lg text-sm text-white placeholder:text-light-200/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />

                </div>

                <div className="sm:col-span-3 space-y-1">

                  <label className="text-xs font-medium text-light-200">
                    Age <span className="text-rose-400">*</span>
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    placeholder="e.g. 25"
                    value={attendee.age}
                    onChange={(e) =>
                      handleMemberChange(index, "age", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-dark-100 border border-border-dark rounded-lg text-sm text-white placeholder:text-light-200/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono"
                  />

                </div>

                <div className="sm:col-span-3 space-y-1">

                  <label className="text-xs font-medium text-light-200">
                    Gender <span className="text-rose-400">*</span>
                  </label>

                  <select
                    value={attendee.gender}
                    onChange={(e) =>
                      handleMemberChange(index, "gender", e.target.value as Gender)
                    }
                    className="w-full px-3 py-2 bg-dark-100 border border-border-dark rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                    <option value={Gender.OTHER}>Other</option>
                  </select>

                </div>

              </div>

            </div>
          );
        })}

      </div>
    );

  }

  function renderErrorMessage() {

    if (!formErrors) {
      return null;
    }

    return (
      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
        {formErrors}
      </div>
    );

  }

  function renderModalFooter() {

    return (
      <div className="p-5 border-t border-border-dark bg-dark-100/50 flex flex-col sm:flex-row items-center justify-between gap-3">

        <button {...addMemberButtonAttributes}>
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Another Attendee</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">

          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-medium text-light-200 hover:text-white hover:bg-dark-200 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button {...submitButtonAttributes}>
            {registerMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Registration ({attendees.length})</span>
              </>
            )}
          </button>

        </div>

      </div>
    );

  }

  return (
    <div {...backdropAttributes}>

      <div {...modalContainerAttributes}>

        {renderModalHeader()}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">

          {renderErrorMessage()}

          <div className="flex items-center justify-between">

            <h3 className="text-xs font-semibold text-light-200 uppercase tracking-wider">
              Attendee Information ({attendees.length})
            </h3>

          </div>

          {renderAttendeeRows()}

          {renderModalFooter()}

        </form>

      </div>

    </div>
  );

};

export default EventRegistrationModal;
